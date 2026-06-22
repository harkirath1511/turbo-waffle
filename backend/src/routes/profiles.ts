import { Router, Response } from 'express';
import { z } from 'zod';
import * as profileService from '../services/profileService';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

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

// GET /profiles/me — get the current user's profile
router.get('/me', async (req, res: Response) => {
  const { userId } = req as unknown as AuthRequest;
  try {
    const profile = await profileService.getProfileByUserId(userId);
    if (!profile) return res.status(404).json({ error: 'No profile found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /profiles/:id
router.get('/:id', async (req, res: Response) => {
  const { userId } = req as unknown as AuthRequest;
  try {
    const profile = await profileService.getProfileById(userId, req.params['id'] as string);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /profiles
router.post('/', async (req, res: Response) => {
  const { userId } = req as unknown as AuthRequest;
  const result = ProfileSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: result.error.flatten() });
  try {
    const profile = await profileService.createProfile(userId, result.data);
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// PUT /profiles/:id
router.put('/:id', async (req, res: Response) => {
  const { userId } = req as unknown as AuthRequest;
  const result = ProfileSchema.partial().safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: result.error.flatten() });
  try {
    const updated = await profileService.updateProfile(userId, req.params['id'] as string, result.data);
    if (!updated) return res.status(404).json({ error: 'Profile not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// DELETE /profiles/:id
router.delete('/:id', async (req, res: Response) => {
  const { userId } = req as unknown as AuthRequest;
  try {
    const deleted = await profileService.deleteProfile(userId, req.params['id'] as string);
    if (!deleted) return res.status(404).json({ error: 'Profile not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
