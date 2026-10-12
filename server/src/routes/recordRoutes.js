import { Router } from 'express';
import { list, save } from '../controllers/recordController.js';
import { extract } from '../controllers/documentController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);
router.post('/extract', extract);
router.get('/', list);
router.post('/', save);

export default router;
