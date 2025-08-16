import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PhoneCall, ArrowRight, Settings } from "lucide-react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user data
  const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

  // Get user's notes
  const { data: notesData } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const notes = notesData || []

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
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
              {userData?.name?.charAt(0) || "U"}
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Manage your voice notes and account</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 bg-transparent" asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <Button className="gap-2">
                <PhoneCall className="h-4 w-4" />
                Call Now
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">PhoneScribe Number</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">(555) 123-NOTE</div>
                <p className="text-xs text-muted-foreground mt-1">Call anytime to create a new note</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link href="/demo">
                    <PhoneCall className="h-3 w-3" />
                    Try Demo
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Your Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notes.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Free service - unlimited notes</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="gap-1" asChild>
                  <Link href="/notes">
                    <ArrowRight className="h-3 w-3" />
                    View All
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Additional cards or content can be added here if needed */}
          </div>
        </div>
      </main>
    </div>
  )
}
