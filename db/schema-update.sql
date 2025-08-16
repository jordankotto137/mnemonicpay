-- We'll keep the users and notes tables as they are
-- But modify the phone_numbers table to have a single shared number

-- Drop the existing phone_numbers table if it exists
DROP TABLE IF EXISTS phone_numbers;

-- Create a new phone_numbers table for the shared number
CREATE TABLE IF NOT EXISTS phone_numbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  number TEXT UNIQUE NOT NULL,
  is_shared BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a verified_callers table to track verified phone numbers
CREATE TABLE IF NOT EXISTS verified_callers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the shared phone number
INSERT INTO phone_numbers (number, is_shared) VALUES ('(555) 123-NOTE', TRUE);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_verified_callers_phone_number ON verified_callers(phone_number);
CREATE INDEX IF NOT EXISTS idx_verified_callers_user_id ON verified_callers(user_id);

-- Update RLS policies
ALTER TABLE verified_callers ENABLE ROW LEVEL SECURITY;

-- Create policies for verified_callers
CREATE POLICY verified_callers_select_own ON verified_callers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY verified_callers_update_own ON verified_callers FOR UPDATE 
USING (auth.uid() = user_id);
