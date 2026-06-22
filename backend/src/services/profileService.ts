import { v4 as uuidv4 } from 'uuid';
import pool from '../db';
import { Profile } from '../types';

export async function createProfile(data: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<Profile> {
  const id = uuidv4();
  const now = new Date().toISOString();
  const { rows } = await pool.query<Profile>(
    `INSERT INTO profiles (id, name, email, education, experience, skills, interests, goals, extra, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [id, data.name, data.email ?? '', data.education, data.experience, data.skills, data.interests, data.goals, data.extra ?? '', now, now]
  );
  return rows[0];
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const { rows } = await pool.query<Profile>('SELECT * FROM profiles WHERE id = $1', [id]);
  return rows[0] ?? null;
}

export async function getAllProfiles(): Promise<Profile[]> {
  const { rows } = await pool.query<Profile>('SELECT * FROM profiles ORDER BY created_at DESC');
  return rows;
}

export async function updateProfile(id: string, data: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>): Promise<Profile | null> {
  const existing = await getProfileById(id);
  if (!existing) return null;
  const updated = { ...existing, ...data, updated_at: new Date().toISOString() };
  const { rows } = await pool.query<Profile>(
    `UPDATE profiles SET name=$1, email=$2, education=$3, experience=$4, skills=$5, interests=$6, goals=$7, extra=$8, updated_at=$9
     WHERE id=$10 RETURNING *`,
    [updated.name, updated.email, updated.education, updated.experience, updated.skills, updated.interests, updated.goals, updated.extra, updated.updated_at, id]
  );
  return rows[0] ?? null;
}

export async function deleteProfile(id: string): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM profiles WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}
