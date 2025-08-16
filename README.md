# PhoneScribe - Voice Notes Made Simple

PhoneScribe allows users to call a single phone number, leave voice notes, and receive both AI-transcribed text and audio files via SMS.

## Features

- 📞 Single shared phone number for all users
- 🔐 Secure caller verification system
- 🤖 AI-powered transcription using OpenAI Whisper
- 📱 SMS delivery of notes and audio files
- 🌐 Web dashboard for note management
- 🔒 Secure authentication and data storage

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

\`\`\`bash
cp .env.example .env.local
\`\`\`

### 2. Supabase Setup

1. Create a new Supabase project
2. Copy your project URL and anon key to `.env.local`
3. Run the database setup:

\`\`\`bash
npm run db:setup
\`\`\`

### 3. Twilio Setup

1. Create a Twilio account
2. Purchase a phone number
3. Set up webhooks:
   - Voice URL: `https://your-domain.com/api/twilio/voice`
   - Recording Status Callback: `https://your-domain.com/api/twilio/recording-status`
4. Add your Twilio credentials to `.env.local`

### 4. OpenAI Setup

1. Create an OpenAI account
2. Generate an API key
3. Add it to `.env.local`

### 5. Deploy

Deploy to Vercel:

\`\`\`bash
vercel --prod
\`\`\`

### 6. Configure Twilio Webhooks

Update your Twilio phone number webhooks to point to your deployed URLs:

- Voice URL: `https://your-domain.vercel.app/api/twilio/voice`
- Recording Status Callback: `https://your-domain.vercel.app/api/twilio/recording-status`

## Usage

1. Users call your Twilio phone number
2. First-time callers verify their phone number
3. Verified users can immediately start recording notes
4. Notes are transcribed and sent via SMS with audio links

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

## Production Considerations

- Set up proper error monitoring (e.g., Sentry)
- Configure rate limiting for API endpoints
- Set up proper logging and analytics
- Consider using a CDN for audio file delivery
- Implement proper backup and disaster recovery
