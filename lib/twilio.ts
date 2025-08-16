import twilio from "twilio"

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  throw new Error("Missing Twilio credentials")
}

export const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER!
export const PHONESCRIBE_NUMBER = process.env.PHONESCRIBE_NUMBER!
