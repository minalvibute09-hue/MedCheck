import { Router } from 'express';
import { list, save } from '../controllers/recordController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', list);
router.post('/', save);

export default router;
