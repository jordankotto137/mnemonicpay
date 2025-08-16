import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const noteId = params.id

    // Get the note from the database
    const { data: noteData, error: noteError } = await supabase
      .from("notes")
      .select("audio_url, user_id, content")
      .eq("id", noteId)
      .single()

    if (noteError || !noteData) {
      return new NextResponse("Note not found", { status: 404 })
    }

    if (!noteData.audio_url) {
      return new NextResponse("Audio not available", { status: 404 })
    }

    // In production, you would redirect to the actual Twilio recording URL
    // For demo purposes, we'll return a JSON response with the note details
    return NextResponse.json({
      id: noteId,
      content: noteData.content,
      audio_url: noteData.audio_url,
      message: "In production, this would redirect to the actual audio file",
    })
  } catch (error) {
    console.error("Error serving audio:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
