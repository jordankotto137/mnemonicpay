-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone_number TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verified_callers table to track verified phone numbers
CREATE TABLE IF NOT EXISTS verified_callers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_code TEXT,
  verification_attempts INTEGER DEFAULT 0,
  last_verification_attempt TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notes table for storing transcribed voice notes
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  content TEXT NOT NULL,
  audio_url TEXT,
  duration INTEGER, -- duration in seconds
  is_favorite BOOLEAN DEFAULT FALSE,
  phone_number TEXT NOT NULL, -- Track which number called
  call_sid TEXT, -- Twilio call SID for reference
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create phone_numbers table for the shared number
CREATE TABLE IF NOT EXISTS phone_numbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number TEXT UNIQUE NOT NULL,
  is_shared BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the shared phone number
INSERT INTO phone_numbers (number, is_shared, is_active) 
VALUES ('+15551234567', TRUE, TRUE) 
ON CONFLICT (number) DO NOTHING;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_verified_callers_phone_number ON verified_callers(phone_number);
CREATE INDEX IF NOT EXISTS idx_verified_callers_user_id ON verified_callers(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE verified_callers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only read and update their own data
CREATE POLICY user_select_own ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY user_update_own ON users FOR UPDATE USING (auth.uid() = id);

-- Verified callers policies
CREATE POLICY verified_callers_select_own ON verified_callers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY verified_callers_update_own ON verified_callers FOR UPDATE 
USING (auth.uid() = user_id);

-- Notes policies
CREATE POLICY notes_select_own ON notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY notes_insert_own ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY notes_update_own ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY notes_delete_own ON notes FOR DELETE USING (auth.uid() = user_id);

-- Phone numbers are readable by all authenticated users
CREATE POLICY phone_numbers_select_all ON phone_numbers FOR SELECT 
USING (auth.role() = 'authenticated');
