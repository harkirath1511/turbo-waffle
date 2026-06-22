import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { extractProfileFromResume } from '../services/resumeService';

const router = Router();

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `resume-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'text/plain'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and plain text files are allowed'));
    }
  },
});

// POST /resume/parse
// Upload a resume file, get back a draft profile object
router.post('/parse', upload.single('resume'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const extracted = await extractProfileFromResume(req.file.path, req.file.mimetype);
    // Clean up uploaded file after parsing
    fs.unlink(req.file.path, () => {});
    res.json(extracted);
  } catch (err) {
    fs.unlink(req.file.path, () => {});
    console.error('Resume parse error:', err);
    res.status(500).json({ error: 'Failed to parse resume. Please try again or enter details manually.' });
  }
});

export default router;
