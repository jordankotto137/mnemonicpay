import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const data = new URLSearchParams(body)

    const From = data.get("From")
    const Digits = data.get("Digits")
    const CallSid = data.get("CallSid")

    if (!From || !Digits || !CallSid) {
      return new NextResponse("Missing required parameters", { status: 400 })
    }

    // Check if the verification code matches
    const { data: callerData, error: callerError } = await supabase
      .from("verified_callers")
      .select("*")
      .eq("phone_number", From)
      .single()

    if (callerError) {
      console.error("Error checking caller:", callerError)
      return new NextResponse("Caller not found", { status: 404 })
    }

    let twimlResponse = ""

    // Check for too many attempts
    if (callerData.verification_attempts >= 3) {
      twimlResponse = `
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say>Too many verification attempts. Please wait 10 minutes before trying again.</Say>
        </Response>
      `
    } else if (callerData.verification_code === Digits) {
      // Code matches, mark as verified
      await supabase
        .from("verified_callers")
        .update({
          is_verified: true,
          verification_code: null,
          verification_attempts: 0,
        })
        .eq("phone_number", From)

      // Proceed with recording
      twimlResponse = `
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say>Thank you! Your phone number has been verified.</Say>
          <Say>You can now leave your note after the beep.</Say>
          <Record maxLength="300" action="/api/twilio/recording" />
          <Say>I didn't hear anything. Goodbye!</Say>
        </Response>
      `
    } else {
      // Code doesn't match, increment attempts
      await supabase
        .from("verified_callers")
        .update({
          verification_attempts: callerData.verification_attempts + 1,
          last_verification_attempt: new Date().toISOString(),
        })
        .eq("phone_number", From)

      const remainingAttempts = 3 - (callerData.verification_attempts + 1)

      if (remainingAttempts > 0) {
        twimlResponse = `
          <?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say>Sorry, that verification code is incorrect. You have ${remainingAttempts} attempts remaining.</Say>
            <Gather numDigits="4" action="/api/twilio/verify-code" method="POST" timeout="10">
              <Say>Please enter your 4-digit verification code.</Say>
            </Gather>
            <Say>No input received. Goodbye!</Say>
          </Response>
        `
      } else {
        twimlResponse = `
          <?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say>Too many incorrect attempts. Please wait 10 minutes before trying again.</Say>
          </Response>
        `
      }
    }

    return new NextResponse(twimlResponse, {
      headers: {
        "Content-Type": "text/xml",
      },
    })
  } catch (error) {
    console.error("Error handling code verification:", error)

    const fallbackTwiml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>Sorry, there was an error. Please try again later.</Say>
      </Response>
    `

    return new NextResponse(fallbackTwiml, {
      headers: { "Content-Type": "text/xml" },
      status: 200,
    })
  }
}
