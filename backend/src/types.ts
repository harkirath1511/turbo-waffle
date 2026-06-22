export type OutreachGoal =
  | 'Internship'
  | 'Job Opportunity'
  | 'Freelance Work'
  | 'Networking'
  | 'Collaboration'
  | 'Mentorship';

export interface Profile {
  id: string;
  name: string;
  email?: string;
  education: string;
  experience: string;
  skills: string;
  interests: string;
  goals: string;
  extra?: string;
  created_at: string;
  updated_at: string;
}

export interface Draft {
  id: string;
  profile_id: string;
  company_name: string;
  company_description: string;
  goal: OutreachGoal;
  subject_line: string;
  opening_paragraph: string;
  why_company: string;
  why_user: string;
  conversation_starter: string;
  full_email: string;
  created_at: string;
}

export interface GenerateRequest {
  profile_id: string;
  company_name: string;
  company_description: string;
  goal: OutreachGoal;
}

export interface GeneratedOutput {
  subject_line: string;
  opening_paragraph: string;
  why_company: string;
  why_user: string;
  conversation_starter: string;
  full_email: string;
}
