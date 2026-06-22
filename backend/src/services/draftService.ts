import { v4 as uuidv4 } from 'uuid';
import pool from '../db';
import { Draft, GeneratedOutput, OutreachGoal } from '../types';

export async function saveDraft(
  profileId: string,
  companyName: string,
  companyDescription: string,
  goal: OutreachGoal,
  output: GeneratedOutput
): Promise<Draft> {
  const id = uuidv4();
  const now = new Date().toISOString();
  const { rows } = await pool.query<Draft>(
    `INSERT INTO drafts (id, profile_id, company_name, company_description, goal, subject_line, opening_paragraph, why_company, why_user, conversation_starter, full_email, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [id, profileId, companyName, companyDescription, goal, output.subject_line, output.opening_paragraph, output.why_company, output.why_user, output.conversation_starter, output.full_email, now]
  );
  return rows[0];
}

export async function getDraftById(id: string): Promise<Draft | null> {
  const { rows } = await pool.query<Draft>('SELECT * FROM drafts WHERE id = $1', [id]);
  return rows[0] ?? null;
}

export async function getDraftsByProfileId(profileId: string): Promise<Draft[]> {
  const { rows } = await pool.query<Draft>('SELECT * FROM drafts WHERE profile_id = $1 ORDER BY created_at DESC', [profileId]);
  return rows;
}

export async function getAllDrafts(): Promise<Draft[]> {
  const { rows } = await pool.query<Draft>('SELECT * FROM drafts ORDER BY created_at DESC');
  return rows;
}

export async function deleteDraft(id: string): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM drafts WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}
