import { Router, Request, Response } from 'express';
import * as draftService from '../services/draftService';

const router = Router();


router.get('/', async (_req: Request, res: Response) => {
  try {
    const drafts = await draftService.getAllDrafts();
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});


router.get('/profile/:profileId', async (req: Request, res: Response) => {
  try {
    const drafts = await draftService.getDraftsByProfileId(req.params['profileId'] as string);
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});


router.get('/:id', async (req: Request, res: Response) => {
  try {
    const draft = await draftService.getDraftById(req.params['id'] as string);
    if (!draft) return res.status(404).json({ error: 'Draft not found' });
    res.json(draft);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});


router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await draftService.deleteDraft(req.params['id'] as string);
    if (!deleted) return res.status(404).json({ error: 'Draft not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
