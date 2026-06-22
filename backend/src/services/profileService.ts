import { v4 as uuidv4 } from 'uuid';
import pool from '../db';
import { Profile } from '../types';

export async function createProfile(userId: string, data: Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Profile> {
  const id = uuidv4();
  const now = new Date().toISOString();
  const { rows } = await pool.query<Profile>(
    `INSERT INTO profiles (id, user_id, name, email, education, experience, skills, interests, goals, extra, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [id, userId, data.name, data.email ?? '', data.education, data.experience, data.skills, data.interests, data.goals, data.extra ?? '', now, now]
  );
  return rows[0];
}

export async function getProfileById(userId: string, id: string): Promise<Profile | null> {
  const { rows } = await pool.query<Profile>('SELECT * FROM profiles WHERE id = $1 AND user_id = $2', [id, userId]);
  return rows[0] ?? null;
}

export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  const { rows } = await pool.query<Profile>('SELECT * FROM profiles WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [userId]);
  return rows[0] ?? null;
}

export async function updateProfile(userId: string, id: string, data: Partial<Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Profile | null> {
  const existing = await getProfileById(userId, id);
  if (!existing) return null;
  const updated = { ...existing, ...data, updated_at: new Date().toISOString() };
  const { rows } = await pool.query<Profile>(
    `UPDATE profiles SET name=$1, email=$2, education=$3, experience=$4, skills=$5, interests=$6, goals=$7, extra=$8, updated_at=$9
     WHERE id=$10 AND user_id=$11 RETURNING *`,
    [updated.name, updated.email, updated.education, updated.experience, updated.skills, updated.interests, updated.goals, updated.extra, updated.updated_at, id, userId]
  );
  return rows[0] ?? null;
}

export async function deleteProfile(userId: string, id: string): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM profiles WHERE id = $1 AND user_id = $2', [id, userId]);
  return (rowCount ?? 0) > 0;
}
