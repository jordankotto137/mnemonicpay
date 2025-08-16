import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const data = new URLSearchParams(body)

    const From = data.get("From")
    const CallSid = data.get("CallSid")

    if (!From || !CallSid) {
      return new NextResponse("Missing required parameters", { status: 400 })
    }

    console.log(`Incoming call from ${From}, CallSid: ${CallSid}`)

    // Check if this caller is already verified
    const { data: callerData, error: callerError } = await supabase
      .from("verified_callers")
      .select("*")
      .eq("phone_number", From)
      .single()

    if (callerError && callerError.code !== "PGRST116") {
      console.error("Error checking caller:", callerError)
    }

    let twimlResponse = ""

    if (callerData?.is_verified) {
      // Caller is verified, proceed with recording
      twimlResponse = `
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say>Welcome back to PhoneScribe. Please leave your note after the beep.</Say>
          <Record maxLength="300" action="/api/twilio/recording" />
          <Say>I didn't hear anything. Goodbye!</Say>
        </Response>
      `
    } else if (callerData && !callerData.is_verified) {
      // Caller exists but not verified, ask for verification code
      twimlResponse = `
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say>Welcome back to PhoneScribe. Please enter your 4-digit verification code.</Say>
          <Gather numDigits="4" action="/api/twilio/verify-code" method="POST" timeout="10">
            <Say>Enter your code now.</Say>
          </Gather>
          <Say>No input received. Goodbye!</Say>
        </Response>
      `
    } else {
      // New caller, start verification process
      twimlResponse = `
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say>Welcome to PhoneScribe. I see this is your first time calling.</Say>
          <Say>The number you're calling from is ${formatPhoneForSpeech(From)}.</Say>
          <Gather numDigits="1" action="/api/twilio/verify-number" method="POST" timeout="10">
            <Say>If this is correct, press 1. To use a different number, press 2.</Say>
          </Gather>
          <Say>No input received. Goodbye!</Say>
        </Response>
      `
    }

    return new NextResponse(twimlResponse, {
      headers: {
        "Content-Type": "text/xml",
      },
    })
  } catch (error) {
    console.error("Error handling Twilio voice webhook:", error)

    // Return a fallback TwiML response
    const fallbackTwiml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>Sorry, there was a technical issue. Please try again later.</Say>
      </Response>
    `

    return new NextResponse(fallbackTwiml, {
      headers: { "Content-Type": "text/xml" },
      status: 200, // Always return 200 to Twilio to prevent retries
    })
  }
}

function formatPhoneForSpeech(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, "")

  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3).split("").join(" ")}, ${cleaned.slice(3, 6).split("").join(" ")}, ${cleaned.slice(6).split("").join(" ")}`
  } else if (cleaned.length === 11 && cleaned[0] === "1") {
    const withoutCountryCode = cleaned.slice(1)
    return `${withoutCountryCode.slice(0, 3).split("").join(" ")}, ${withoutCountryCode.slice(3, 6).split("").join(" ")}, ${withoutCountryCode.slice(6).split("").join(" ")}`
  }

  return phoneNumber
}
