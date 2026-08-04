import express from 'express';
import { analyzeText, smartSearch, chatReflection } from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/analyze', analyzeText);
router.post('/smart-search', smartSearch);
router.post('/chat-reflection', chatReflection);

export default router;
