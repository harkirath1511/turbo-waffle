-- Run this in your Supabase SQL editor to create the required tables

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT DEFAULT '',
  education TEXT NOT NULL DEFAULT '',
  experience TEXT NOT NULL DEFAULT '',
  skills TEXT NOT NULL DEFAULT '',
  interests TEXT NOT NULL DEFAULT '',
  goals TEXT NOT NULL DEFAULT '',
  extra TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_description TEXT NOT NULL,
  goal TEXT NOT NULL,
  subject_line TEXT NOT NULL,
  opening_paragraph TEXT NOT NULL,
  why_company TEXT NOT NULL,
  why_user TEXT NOT NULL,
  conversation_starter TEXT NOT NULL,
  full_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS drafts_profile_id_idx ON drafts(profile_id);
CREATE INDEX IF NOT EXISTS drafts_created_at_idx ON drafts(created_at DESC);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON profiles(created_at DESC);
