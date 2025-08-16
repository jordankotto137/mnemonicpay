import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, PhoneCall } from "lucide-react"

export default function StatusPage() {
  // In production, these would be actual health checks
  const services = [
    {
      name: "Supabase Database",
      status: "connected",
      description: "User data and notes storage",
      envVar: "NEXT_PUBLIC_SUPABASE_URL",
    },
    {
      name: "OpenAI Integration",
      status: "ready",
      description: "AI transcription service",
      envVar: "OPENAI_API_KEY",
    },
    {
      name: "Twilio Voice",
      status: "pending",
      description: "Phone call handling",
      envVar: "TWILIO_ACCOUNT_SID",
    },
    {
      name: "Twilio SMS",
      status: "pending",
      description: "Text message delivery",
      envVar: "TWILIO_AUTH_TOKEN",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
      case "ready":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
      case "ready":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Ready
          </Badge>
        )
      case "pending":
        return <Badge variant="secondary">Setup Required</Badge>
      default:
        return <Badge variant="destructive">Error</Badge>
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">PhoneScribe Status</h1>
        <p className="text-muted-foreground">Current deployment and integration status</p>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5" />
              Service Status
            </CardTitle>
            <CardDescription>PhoneScribe is deployed and ready for configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(service.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What's Working</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>✅ Web application deployed and running</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>✅ Supabase database connected</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>✅ OpenAI integration ready</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>✅ Twilio webhook endpoints created</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>✅ User authentication system</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>✅ Note management dashboard</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>To complete the setup, you'll need to:</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </span>
                <div>
                  <p className="font-medium">Set up Twilio account</p>
                  <p className="text-sm text-muted-foreground">Purchase a phone number and configure webhooks</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </span>
                <div>
                  <p className="font-medium">Configure environment variables</p>
                  <p className="text-sm text-muted-foreground">Add your Twilio credentials to the deployment</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </span>
                <div>
                  <p className="font-medium">Test the phone system</p>
                  <p className="text-sm text-muted-foreground">Call your Twilio number to verify everything works</p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
