import axios from 'axios';
import type { Profile, Draft, GeneratedOutput, OutreachGoal } from './types';
import { supabase } from './supabase';

const api = axios.create({ baseURL: '/api' });

// Attach the Supabase JWT to every request automatically
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Profiles
export const getMyProfile = () => api.get<Profile>('/profiles/me').then(r => r.data);
export const getProfile = (id: string) => api.get<Profile>(`/profiles/${id}`).then(r => r.data);
export const createProfile = (data: Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
  api.post<Profile>('/profiles', data).then(r => r.data);
export const updateProfile = (id: string, data: Partial<Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) =>
  api.put<Profile>(`/profiles/${id}`, data).then(r => r.data);
export const deleteProfile = (id: string) => api.delete(`/profiles/${id}`).then(r => r.data);

// Resume parsing
export const parseResume = (file: File) => {
  const form = new FormData();
  form.append('resume', file);
  return api.post<Omit<Profile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>('/resume/parse', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};

// Generate
export const generate = (payload: {
  profile_id: string;
  company_name: string;
  company_description: string;
  goal: OutreachGoal;
  custom_instructions?: string;
  save?: boolean;
}) => api.post<{ output: GeneratedOutput; draft: Draft | null }>('/generate', payload).then(r => r.data);

// Drafts
export const getDrafts = () => api.get<Draft[]>('/drafts').then(r => r.data);
export const deleteDraft = (id: string) => api.delete(`/drafts/${id}`).then(r => r.data);
