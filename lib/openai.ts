import OpenAI from "openai"

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OpenAI API key")
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function transcribeAudio(audioUrl: string): Promise<string> {
  try {
    // Download the audio file
    const response = await fetch(audioUrl)
    const audioBuffer = await response.arrayBuffer()

    // Create a File object for the transcription
    const audioFile = new File([audioBuffer], "recording.wav", { type: "audio/wav" })

    // Transcribe using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "en",
    })

    return transcription.text
  } catch (error) {
    console.error("Error transcribing audio:", error)
    throw new Error("Failed to transcribe audio")
  }
}
