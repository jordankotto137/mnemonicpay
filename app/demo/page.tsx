"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PhoneCall, Mic, MicOff, MessageSquare, ArrowLeft, Check } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export default function DemoPage() {
  const isMobile = useMobile()
  const [status, setStatus] = useState<"idle" | "verifying" | "verified" | "recording" | "processing" | "complete">(
    "idle",
  )
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcript, setTranscript] = useState("")
  const [audioUrl, setAudioUrl] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("(555) 987-6543")
  const [verificationCode, setVerificationCode] = useState("1234")
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Mock transcripts for demo
  const mockTranscripts = [
    "Remember to schedule a team meeting for next Tuesday at 2 PM to discuss the quarterly results.",
    "Pick up milk, eggs, and bread on the way home. Also need to call the plumber about the leaky faucet.",
    "Ideas for Sarah's birthday party: book a restaurant, order a cake, and invite her college friends. Budget around $300.",
  ]

  useEffect(() => {
    if (status === "recording") {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [status])

  const startDemo = () => {
    setStatus("verifying")
  }

  const verifyNumber = () => {
    setStatus("verified")
  }

  const startRecording = () => {
    setStatus("recording")
    setRecordingTime(0)
  }

  const stopRecording = () => {
    setStatus("processing")

    // Simulate processing delay
    setTimeout(() => {
      // Pick a random mock transcript
      const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)]
      setTranscript(randomTranscript)
      setAudioUrl("https://example.com/audio/demo-recording.mp3")
      setStatus("complete")
    }, 2000)
  }

  const resetDemo = () => {
    setStatus("idle")
    setRecordingTime(0)
    setTranscript("")
    setAudioUrl("")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">PhoneScribe Demo</h1>
            <p className="text-muted-foreground">Experience how PhoneScribe works without making an actual call</p>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Voice Note Demo</CardTitle>
              <CardDescription>Click the button below to simulate a call to PhoneScribe</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {status === "idle" && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <PhoneCall className="h-10 w-10 text-primary" />
                  </div>
                  <Button size="lg" onClick={startDemo} className="gap-2">
                    <PhoneCall className="h-4 w-4" />
                    Start Demo Call
                  </Button>
                </div>
              )}

              {status === "verifying" && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <PhoneCall className="h-10 w-10 text-primary" />
                  </div>
                  <div className="text-center mb-6">
                    <p className="text-muted-foreground mb-2">The number you're calling from is:</p>
                    <p className="text-xl font-medium">{phoneNumber}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button size="lg" onClick={verifyNumber} className="gap-2">
                      <Check className="h-4 w-4" />
                      Confirm Number
                    </Button>
                    <Button size="lg" variant="outline" onClick={resetDemo}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {status === "verified" && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                    <Check className="h-10 w-10 text-green-500" />
                  </div>
                  <div className="text-center mb-6">
                    <p className="font-medium mb-2">Your number has been verified!</p>
                    <p className="text-muted-foreground">You can now record your voice note.</p>
                  </div>
                  <Button size="lg" onClick={startRecording} className="gap-2">
                    <Mic className="h-4 w-4" />
                    Start Recording
                  </Button>
                </div>
              )}

              {status === "recording" && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 animate-pulse">
                    <Mic className="h-10 w-10 text-red-500" />
                  </div>
                  <div className="text-xl font-mono mb-4">{formatTime(recordingTime)}</div>
                  <p className="text-muted-foreground mb-6">Recording... Speak your note now</p>
                  <Button size="lg" variant="destructive" onClick={stopRecording} className="gap-2">
                    <MicOff className="h-4 w-4" />
                    End Recording
                  </Button>
                </div>
              )}

              {status === "processing" && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                  <p className="text-muted-foreground">Processing your note...</p>
                </div>
              )}

              {status === "complete" && (
                <div className="py-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Note Transcribed</p>
                      <p className="text-sm text-muted-foreground">Recording length: {formatTime(recordingTime)}</p>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 text-sm border border-dashed mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4" />
                      <p className="font-medium">Text Message</p>
                      <span className="text-xs text-muted-foreground ml-auto">Just now</span>
                    </div>
                    <p>📝 Your PhoneScribe Note:</p>
                    <p className="mt-2">{transcript}</p>
                    <div className="mt-3 pt-3 border-t border-dashed">
                      <p>
                        🔊{" "}
                        <a href={audioUrl} className="text-primary hover:underline">
                          Listen to your audio recording
                        </a>
                      </p>
                    </div>
                  </div>

                  <Button size="lg" onClick={resetDemo} className="w-full">
                    Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4 mt-2">
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Call Our PhoneScribe Number</p>
                    <p className="text-sm text-muted-foreground">Call (555) 123-NOTE from any phone, anytime.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Verify Your Number</p>
                    <p className="text-sm text-muted-foreground">
                      First-time callers verify their phone number for secure access.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Record Your Note</p>
                    <p className="text-sm text-muted-foreground">
                      After the beep, start speaking. Our AI listens and records everything.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">4</span>
                  </div>
                  <div>
                    <p className="font-medium">Receive Your Note</p>
                    <p className="text-sm text-muted-foreground">
                      Get both the transcription and audio file via text message.
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">Learn More</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="border-t py-6 mt-auto">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 font-medium">
              <PhoneCall className="h-4 w-4" />
              <span>PhoneScribe</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PhoneScribe. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
