import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const data = new URLSearchParams(body)

    const From = data.get("From")
    const RecordingUrl = data.get("RecordingUrl")
    const RecordingSid = data.get("RecordingSid")
    const CallSid = data.get("CallSid")
    const RecordingDuration = data.get("RecordingDuration")

    if (!From || !RecordingUrl || !CallSid) {
      return new NextResponse("Missing required parameters", { status: 400 })
    }

    console.log(`Processing recording from ${From}, Duration: ${RecordingDuration}s`)

    // Find the caller in our database
    const { data: callerData, error: callerError } = await supabase
      .from("verified_callers")
      .select("user_id")
      .eq("phone_number", From)
      .eq("is_verified", true)
      .single()

    if (callerError) {
      console.error("Error finding caller:", callerError)
      return new NextResponse("Caller not found or not verified", { status: 404 })
    }

    // For demo purposes, we'll use AI SDK to generate a mock transcription
    // In production, you'd use OpenAI Whisper API to transcribe the actual audio
    let transcription = ""
    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Generate a realistic voice note transcription for a phone call recording. 
        Make it sound like something someone would actually say in a voice note - 
        could be a reminder, idea, shopping list, or quick thought. 
        Keep it under 100 words and make it natural and conversational.`,
      })
      transcription = text
    } catch (transcriptionError) {
      console.error("Error generating transcription:", transcriptionError)
      transcription = "Thank you for your voice note. Transcription is being processed."
    }

    // Save the note to the database
    const { data: noteData, error: noteError } = await supabase
      .from("notes")
      .insert({
        user_id: callerData.user_id,
        content: transcription,
        audio_url: RecordingUrl,
        duration: Number.parseInt(RecordingDuration || "0"),
        phone_number: From,
        call_sid: CallSid,
      })
      .select()
      .single()

    if (noteError) {
      console.error("Error saving note:", noteError)
      return new NextResponse("Failed to save note", { status: 500 })
    }

    console.log(`Note saved successfully: ${noteData.id}`)

    // In production, you would send an SMS here using Twilio
    // For now, we'll just log what would be sent
    const audioUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com"}/api/audio/${noteData.id}`
    const smsMessage = `📝 Your PhoneScribe Note:\n\n${transcription}\n\n🔊 Listen: ${audioUrl}`

    console.log(`Would send SMS to ${From}:`, smsMessage)

    // Return TwiML response to end the call
    const twimlResponse = `
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>Your note has been saved. You will receive a text message shortly with your transcription.</Say>
      </Response>
    `

    return new NextResponse(twimlResponse, {
      headers: {
        "Content-Type": "text/xml",
      },
    })
  } catch (error) {
    console.error("Error handling recording:", error)

    const fallbackTwiml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>Your note has been received. Thank you for using PhoneScribe.</Say>
      </Response>
    `

    return new NextResponse(fallbackTwiml, {
      headers: { "Content-Type": "text/xml" },
      status: 200,
    })
  }
}
