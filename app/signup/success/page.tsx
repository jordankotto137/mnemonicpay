import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PhoneCall, Check, ArrowRight } from "lucide-react"

export default function SuccessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Link href="/" className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5" />
              <span>PhoneScribe</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container max-w-md">
          <div className="relative mb-8">
            <div className="absolute left-0 top-1/2 w-full h-0.5 bg-muted -translate-y-1/2"></div>
            <div className="relative flex justify-between">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center z-10">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-xs mt-1">Account</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center z-10">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-xs mt-1">Confirm</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center z-10">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-xs mt-1">Success</span>
              </div>
            </div>
          </div>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                <Check className="h-6 w-6 text-emerald-600" />
              </div>
              <CardTitle className="text-xl">Your Account Is Ready!</CardTitle>
              <CardDescription>Your PhoneScribe account has been created successfully</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg border border-dashed">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <PhoneCall className="h-5 w-5 text-primary" />
                  <span className="font-medium text-lg">(555) 123-4567</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This is your dedicated PhoneScribe number. Call anytime to create a note.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">What's next?</h3>
                <ul className="space-y-3 text-sm text-left">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">1</span>
                    </div>
                    <span>Call your PhoneScribe number to create your first voice note</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">2</span>
                    </div>
                    <span>Check your text messages to see your transcribed note</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">3</span>
                    </div>
                    <span>Visit your dashboard to manage your notes and account</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/demo">Try Demo Call</Link>
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
