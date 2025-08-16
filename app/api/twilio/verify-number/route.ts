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

    let twimlResponse = ""

    if (Digits === "1") {
      // User confirmed their number is correct
      const verificationCode = Math.floor(1000 + Math.random() * 9000).toString()

      // Create or update the verified_callers record
      const { error: upsertError } = await supabase.from("verified_callers").upsert({
        phone_number: From,
        verification_code: verificationCode,
        is_verified: false,
        verification_attempts: 0,
        last_verification_attempt: new Date().toISOString(),
      })

      if (upsertError) {
        console.error("Error creating caller record:", upsertError)
        twimlResponse = `
          <?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say>Sorry, there was an error. Please try again later.</Say>
          </Response>
        `
      } else {
        // In production, you would send SMS here
        console.log(`Would send verification code ${verificationCode} to ${From}`)

        twimlResponse = `
          <?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say>Great! We would send a verification code to your phone.</Say>
            <Say>For this demo, your verification code is ${verificationCode.split("").join(" ")}.</Say>
            <Say>Please call back and enter that code when prompted.</Say>
          </Response>
        `
      }
    } else if (Digits === "2") {
      // User wants to use a different number
      twimlResponse = `
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say>To use a different phone number, please visit our website and update your account settings.</Say>
        </Response>
      `
    } else {
      // Invalid input
      twimlResponse = `
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Say>Sorry, I did not understand that input.</Say>
          <Redirect>/api/twilio/voice</Redirect>
        </Response>
      `
    }

    return new NextResponse(twimlResponse, {
      headers: {
        "Content-Type": "text/xml",
      },
    })
  } catch (error) {
    console.error("Error handling number verification:", error)

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
