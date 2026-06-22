import fs from 'fs';

const pdfParse: (buf: Buffer) => Promise<{ text: string }> = require('pdf-parse');
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a resume parser. Extract structured profile information from the resume text and return a JSON object with exactly these fields:
- name: full name of the person
- email: email address (or empty string if not found)
- education: description of educational background (degrees, institutions, years, relevant coursework)
- experience: description of work experience (companies, roles, dates, key responsibilities and achievements)
- skills: list of technical and professional skills
- interests: professional interests, passions, areas of curiosity
- goals: career objectives, what they are looking for, where they want to go
- extra: any other relevant information (projects, certifications, publications, volunteering)`;

export async function extractProfileFromResume(filePath: string, mimeType: string): Promise<{
  name: string;
  email: string;
  education: string;
  experience: string;
  skills: string;
  interests: string;
  goals: string;
  extra: string;
}> {
  let text: string;

  if (mimeType === 'application/pdf') {
    const buffer = fs.readFileSync(filePath);
    const parsed = await pdfParse(buffer);
    text = parsed.text;
  } else {
    text = fs.readFileSync(filePath, 'utf-8');
  }

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Extract the profile from this resume:\n\n${text}` },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? '{}';
  return JSON.parse(raw);
}
