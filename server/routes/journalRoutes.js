import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { 
  createJournal, 
  getJournals, 
  getJournalById, 
  deleteJournal, 
  voiceTranscribe 
} from '../controllers/journalController.js';
import { authenticateToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

const router = express.Router();

router.use(authenticateToken);

router.post('/', createJournal);
router.get('/', getJournals);
router.get('/:id', getJournalById);
router.delete('/:id', deleteJournal);
router.post('/voice', upload.single('audio'), voiceTranscribe);

export default router;
