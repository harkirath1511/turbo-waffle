import { Router, Request, Response } from 'express';
import { string, z } from 'zod';
import * as profileService from '../services/profileService';

const router = Router();

const ProfileSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  education: z.string().min(1),
  experience: z.string().min(1),
  skills: z.array(z.string()).min(1),
  interests: z.string().min(1),
  goals: z.string().min(1),
  extra: z.string().optional(),
});


router.get('/', async (_req: Request, res: Response) => {
  try {
    const profiles = await profileService.getAllProfiles();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});


router.get('/:id', async (req: Request, res: Response) => {
  try {
    const profile = await profileService.getProfileById(req.params['id'] as string);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});


router.post('/', async (req: Request, res: Response) => {
  const result = ProfileSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: result.error.flatten() });
  try {
    const profile = await profileService.createProfile(result.data);
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});


router.put('/:id', async (req: Request, res: Response) => {
  const result = ProfileSchema.partial().safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: result.error.flatten() });
  try {
    const updated = await profileService.updateProfile(req.params['id'] as string, result.data);
    if (!updated) return res.status(404).json({ error: 'Profile not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});


router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await profileService.deleteProfile(req.params['id'] as string);
    if (!deleted) return res.status(404).json({ error: 'Profile not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
