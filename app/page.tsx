import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PhoneCall, MessageSquare, Check, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <PhoneCall className="h-5 w-5" />
            <span>PhoneScribe</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="#how-it-works" className="text-sm font-medium">
              How It Works
            </Link>
            <Link href="#features" className="text-sm font-medium">
              Features
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
            <Button size="sm" asChild>
              <Link href="/signup">Sign Up Free</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container flex flex-col items-center text-center">
            <div className="inline-block bg-emerald-100 text-emerald-800 text-xs font-medium px-3 py-1 rounded-full mb-6">
              100% FREE
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Voice Notes, <span className="text-primary">Simplified</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px] mb-6">
              Just call our number, speak your thoughts, and receive your notes as text messages. No apps, no hassle.
            </p>

            <div className="bg-primary/10 rounded-lg py-3 px-6 mb-8">
              <p className="text-2xl font-bold text-primary">(555) 123-NOTE</p>
              <p className="text-sm text-muted-foreground">Our easy-to-remember phone number</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/signup">
                  <PhoneCall className="h-4 w-4" />
                  Sign Up Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link href="/demo">
                  <MessageSquare className="h-4 w-4" />
                  See Demo
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <PhoneCall className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Call Our Number</h3>
                <p className="text-muted-foreground">Dial (555) 123-NOTE from any phone, anytime, anywhere.</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Verify Your Number</h3>
                <p className="text-muted-foreground">First-time callers verify their phone number for secure access.</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Speak Your Note</h3>
                <p className="text-muted-foreground">
                  After the beep, start talking. Our AI listens and transcribes everything you say.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Receive Your Note</h3>
                <p className="text-muted-foreground">Get both the transcription and audio file via text message.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-16">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6">See It In Action</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  PhoneScribe makes capturing your thoughts as easy as making a phone call. Perfect for:
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Quick ideas while driving</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Meeting notes on the go</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Shopping lists when your hands are full</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Journal entries before bed</span>
                  </li>
                </ul>
                <Button className="gap-2" asChild>
                  <Link href="/signup">
                    <PhoneCall className="h-4 w-4" />
                    Try It Now - Free
                  </Link>
                </Button>
              </div>
              <div className="flex-1">
                <div className="bg-muted rounded-lg p-6 border shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <PhoneCall className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Incoming Call</p>
                      <p className="text-sm text-muted-foreground">PhoneScribe (555) 123-NOTE</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-primary/10 rounded-lg p-4 text-sm">
                      <p className="font-medium text-primary mb-1">PhoneScribe</p>
                      <p>
                        "Welcome to PhoneScribe. I see this is your first time calling. The number you're calling from
                        is (555) 987-6543. If this is correct, press 1."
                      </p>
                    </div>
                    <div className="bg-background rounded-lg p-4 text-sm border">
                      <p className="font-medium mb-1">You</p>
                      <p>*presses 1*</p>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-4 text-sm">
                      <p className="font-medium text-primary mb-1">PhoneScribe</p>
                      <p>"Great! We'll send a verification code to your phone. Please call back with that code."</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-sm border border-dashed">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4" />
                        <p className="font-medium">Text Message</p>
                        <span className="text-xs text-muted-foreground ml-auto">Just now</span>
                      </div>
                      <p>Your PhoneScribe verification code is: 1234</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-4">Everything You Need, For Free</h2>
            <p className="text-center text-muted-foreground max-w-[600px] mx-auto mb-12">
              PhoneScribe is completely free to use, with all the features you need to capture your thoughts on the go.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-background rounded-lg p-6 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <PhoneCall className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">One Simple Number</h3>
                <p className="text-muted-foreground">
                  Just one easy-to-remember phone number for all your voice notes.
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Caller Verification</h3>
                <p className="text-muted-foreground">Secure verification ensures only you can access your notes.</p>
              </div>

              <div className="bg-background rounded-lg p-6 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">SMS Delivery</h3>
                <p className="text-muted-foreground">
                  Receive your transcribed notes as text messages directly on your phone.
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <path d="M14 9a2 2 0 0 1-2 2H6"></path>
                    <path d="M14 13a2 2 0 0 1-2 2H6"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Transcription</h3>
                <p className="text-muted-foreground">
                  Advanced AI technology accurately transcribes your voice notes into text.
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Audio Files</h3>
                <p className="text-muted-foreground">
                  Access both the transcription and the original audio recording of your notes.
                </p>
              </div>

              <div className="bg-background rounded-lg p-6 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">No App Required</h3>
                <p className="text-muted-foreground">
                  Use PhoneScribe from any phone without downloading or installing anything.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/signup">
                  <ArrowRight className="h-4 w-4" />
                  Get Started - It's Free
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 font-bold">
              <PhoneCall className="h-5 w-5" />
              <span>PhoneScribe</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PhoneScribe. All rights reserved.
            </div>
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
