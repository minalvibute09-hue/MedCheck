import { Router } from 'express';
import { ask, history } from '../controllers/chatController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);
router.post('/ask', ask);
router.get('/history', history);

export default router;
