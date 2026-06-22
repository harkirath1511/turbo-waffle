import axios from 'axios';
import type { Profile, Draft, GeneratedOutput, OutreachGoal } from './types';

const api = axios.create({ baseURL: '/api' });


export const getProfiles = () => api.get<Profile[]>('/profiles').then(r => r.data);
export const getProfile = (id: string) => api.get<Profile>(`/profiles/${id}`).then(r => r.data);
export const createProfile = (data: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) =>
  api.post<Profile>('/profiles', data).then(r => r.data);
export const updateProfile = (id: string, data: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) =>
  api.put<Profile>(`/profiles/${id}`, data).then(r => r.data);
export const deleteProfile = (id: string) => api.delete(`/profiles/${id}`).then(r => r.data);


export const parseResume = (file: File) => {
  const form = new FormData();
  form.append('resume', file);
  return api.post<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>('/resume/parse', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};


export const generate = (payload: {
  profile_id: string;
  company_name: string;
  company_description: string;
  goal: OutreachGoal;
  custom_instructions?: string;
  save?: boolean;
}) => api.post<{ output: GeneratedOutput; draft: Draft | null }>('/generate', payload).then(r => r.data);


export const getDrafts = () => api.get<Draft[]>('/drafts').then(r => r.data);
export const getDraftsByProfile = (profileId: string) =>
  api.get<Draft[]>(`/drafts/profile/${profileId}`).then(r => r.data);
export const deleteDraft = (id: string) => api.delete(`/drafts/${id}`).then(r => r.data);
