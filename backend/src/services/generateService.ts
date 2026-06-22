import Groq from 'groq-sdk';
import type { Profile, OutreachGoal, GeneratedOutput } from '../types';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const GOAL_CONTEXT: Record<OutreachGoal, string> = {
  'Internship': 'seeking an internship opportunity',
  'Job Opportunity': 'exploring a full-time role',
  'Freelance Work': 'offering freelance services',
  'Networking': 'connecting and building a professional relationship',
  'Collaboration': 'proposing a collaboration or partnership',
  'Mentorship': 'seeking mentorship and guidance',
};

export async function generateOutreach(
  profile: Profile,
  companyName: string,
  companyDescription: string,
  goal: OutreachGoal
): Promise<GeneratedOutput> {
  const goalContext = GOAL_CONTEXT[goal];

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are a master at writing cold outreach emails that actually get replies. Your emails sound like they were written by a real, thoughtful person — not a template, not a bot.

Rules you must follow:
- Never open with "I hope this email finds you well", "My name is...", "I'm reaching out because...", or any similar filler
- Never use generic praise like "I'm a huge fan", "I love what you're doing", "Your company is amazing"
- Never use corporate buzzwords: synergy, leverage, circle back, touch base, value-add, etc.
- Never include placeholders like [Your Name] or [Company Name] — always use the actual values
- Sound like a real person with genuine curiosity and confidence
- Be concise — every sentence should earn its place
- Reference specifics from both the company description and the person's actual background
- The tone should be professional but warm, direct but not pushy

Always return a JSON object with exactly these fields:
- subject_line: a compelling, specific subject line
- opening_paragraph: 2-3 sentences that hook immediately
- why_company: 2-3 sentences on what genuinely interests them about this company
- why_user: 2-3 sentences on why they specifically are relevant or valuable to this company
- conversation_starter: one thoughtful question or observation that invites a real reply
- full_email: the complete ready-to-send email combining all elements, signed off with the person's name`,
      },
      {
        role: 'user',
        content: `Write a cold outreach email for someone ${goalContext}.

PERSON'S PROFILE:
Name: ${profile.name}
Email: ${profile.email || 'not provided'}
Education: ${profile.education}
Experience: ${profile.experience}
Skills: ${profile.skills}
Interests: ${profile.interests}
Goals: ${profile.goals}
${profile.extra ? `Additional info: ${profile.extra}` : ''}

TARGET COMPANY:
Company name: ${companyName}
Company description: ${companyDescription}

Goal of outreach: ${goal}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? '{}';
  return JSON.parse(raw) as GeneratedOutput;
}
