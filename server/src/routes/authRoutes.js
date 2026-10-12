import { Router } from 'express';
import { login, register } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { findUserById, toPublicUser } from '../models/User.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Account not found.' });
    return res.json({ user: toPublicUser(user) });
  } catch (error) {
    return next(error);
  }
});

export default router;
