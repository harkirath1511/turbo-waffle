DROP TABLE IF EXISTS drafts;
DROP TABLE IF EXISTS profiles;

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT DEFAULT '',
  education TEXT NOT NULL DEFAULT '',
  experience TEXT NOT NULL DEFAULT '',
  skills TEXT[] NOT NULL DEFAULT '{}',
  interests TEXT NOT NULL DEFAULT '',
  goals TEXT NOT NULL DEFAULT '',
  extra TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

CREATE INDEX ON profiles(user_id);
CREATE INDEX ON drafts(user_id);
CREATE INDEX ON drafts(profile_id);
CREATE INDEX ON drafts(created_at DESC);
