import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, toPublicUser } from '../models/User.js';

function createToken(user) {
  return jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
}

export async function register(req, res, next) {
  const fullName = typeof req.body.fullName === 'string' ? req.body.fullName.trim() : '';
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (fullName.length < 2 || fullName.length > 100) {
    return res.status(400).json({ error: 'Enter a name between 2 and 100 characters.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }
  if (password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({ error: 'Password must be at least 8 characters and no more than 72 bytes.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = { _id: randomUUID(), fullName, email };
    await createUser({ id: user._id, fullName, email, passwordHash });
    return res.status(201).json({ token: createToken(user), user: toPublicUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }
    return next(error);
  }
}

export async function login(req, res, next) {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!email || !password) {
    return res.status(400).json({ error: 'Enter your email and password.' });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Email or password is incorrect.' });
    }
    return res.json({ token: createToken(user), user: toPublicUser(user) });
  } catch (error) {
    return next(error);
  }
}
