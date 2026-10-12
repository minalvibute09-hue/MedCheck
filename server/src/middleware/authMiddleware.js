import jwt from 'jsonwebtoken';
import { findUserById } from '../models/User.js';

export async function requireAuth(req, res, next) {
  const token = req.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return res.status(401).json({ error: 'Sign in to continue.' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await findUserById(payload.sub);
    if (!user) return res.status(401).json({ error: 'Your account is no longer available. Sign in again.' });
    req.user = { id: user.id, fullName: user.full_name, email: user.email };
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Your session has expired. Sign in again.' });
    }
    return next(error);
  }
}
