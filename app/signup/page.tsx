"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PhoneCall, Check, ArrowLeft } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (step === 1) {
      setStep(2)
      return
    }

    setIsSubmitting(true)

    try {
      // Sign up with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
          },
        },
      })

      if (signUpError) throw signUpError

      // Create user record in our database
      const { error: insertError } = await supabase.from("users").insert({
        id: data.user?.id,
        email: formData.email,
        name: formData.name,
        phone_number: formData.phone,
      })

      if (insertError) throw insertError

      // Assign a phone number (in a real app, this would integrate with Twilio)
      const { error: phoneError } = await supabase.from("phone_numbers").insert({
        number: `(555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
        user_id: data.user?.id,
      })

      if (phoneError) throw phoneError

      router.push("/signup/success")
    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "An error occurred during signup")
      setIsSubmitting(false)
    }
  }

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
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Cancel
          </Link>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container max-w-md">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
            <h1 className="text-2xl font-bold mb-2">Create Your Free Account</h1>
            <p className="text-muted-foreground">Get your own dedicated phone number for voice notes.</p>
          </div>

          <div className="relative mb-8">
            <div className="absolute left-0 top-1/2 w-full h-0.5 bg-muted -translate-y-1/2"></div>
            <div className="relative flex justify-between">
              <div className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center z-10 ${
                    step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > 1 ? <Check className="h-4 w-4" /> : "1"}
                </div>
                <span className="text-xs mt-1">Account</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center z-10 ${
                    step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > 2 ? <Check className="h-4 w-4" /> : "2"}
                </div>
                <span className="text-xs mt-1">Confirm</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center z-10 ${
                    step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  3
                </div>
                <span className="text-xs mt-1">Success</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
                  <CardDescription>Enter your details to create your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Confirm Your Details</CardTitle>
                  <CardDescription>Review your information before creating your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg border border-dashed">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">PhoneScribe Account</h3>
                      <span className="text-sm font-medium text-emerald-600">Free</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get your own dedicated phone number for voice notes
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>Dedicated phone number</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>SMS delivery of transcribed notes</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>AI-powered transcription</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5" />
                        <span>Note management dashboard</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Name</span>
                      <span>{formData.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email</span>
                      <span>{formData.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phone</span>
                      <span>{formData.phone}</span>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 p-3 rounded-md border border-red-200 text-sm text-red-600">{error}</div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="mr-2">Creating Account</span>
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      </>
                    ) : (
                      "Create Free Account"
                    )}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setStep(1)} disabled={isSubmitting}>
                    Back
                  </Button>
                </CardFooter>
              </Card>
            )}
          </form>
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
