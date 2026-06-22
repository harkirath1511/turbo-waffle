import { Router, Response } from 'express';
import * as draftService from '../services/draftService';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res: Response) => {
  const { userId } = req as unknown as AuthRequest;
  try {
    const drafts = await draftService.getAllDrafts(userId);
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/:id', async (req, res: Response) => {
  const { userId } = req as unknown as AuthRequest;
  try {
    const draft = await draftService.getDraftById(userId, req.params['id'] as string);
    if (!draft) return res.status(404).json({ error: 'Draft not found' });
    res.json(draft);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.delete('/:id', async (req, res: Response) => {
  const { userId } = req as unknown as AuthRequest;
  try {
    const deleted = await draftService.deleteDraft(userId, req.params['id'] as string);
    if (!deleted) return res.status(404).json({ error: 'Draft not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
