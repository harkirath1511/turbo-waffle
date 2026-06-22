import { Router, Request, Response } from 'express';
import { z } from 'zod';
import * as profileService from '../services/profileService';
import * as draftService from '../services/draftService';
import { generateOutreach } from '../services/generateService';
import { OutreachGoal } from '../types';

const router = Router();

const GOALS: OutreachGoal[] = [
  'Internship',
  'Job Opportunity',
  'Freelance Work',
  'Networking',
  'Collaboration',
  'Mentorship',
];

const GenerateSchema = z.object({
  profile_id: z.string().uuid(),
  company_name: z.string().min(1),
  company_description: z.string().min(10),
  goal: z.enum(GOALS as [OutreachGoal, ...OutreachGoal[]]),
  save: z.boolean().optional().default(true),
});


router.post('/', async (req: Request, res: Response) => {
  const result = GenerateSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: result.error.flatten() });

  const { profile_id, company_name, company_description, goal, save } = result.data;

  const profile = await profileService.getProfileById(profile_id);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });

  try {
    const output = await generateOutreach(profile, company_name, company_description, goal);

    let draft = null;
    if (save) {
      draft = await draftService.saveDraft(profile_id, company_name, company_description, goal, output);
    }

    res.json({ output, draft });
  } catch (err) {
    console.error('Generation error:', err);
    res.status(500).json({ error: 'Failed to generate outreach. Please try again.' });
  }
});

export default router;
