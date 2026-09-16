const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../models/database');

const jwtSecret = process.env.JWT_SECRET || 'academic-verifier-development-secret';
const sessionDays = 7;

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.created_at };
}

function createToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: `${sessionDays}d` });
}

async function saveSession(user, token) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + sessionDays * 86400000).toISOString();
  await database.run('INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)', [user.id, tokenHash, expiresAt]);
}

async function signUp(req, res) {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: 'Name, email, and password are required.' });
  if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const existing = await database.get('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
    if (existing) return res.status(409).json({ message: 'An account with that email already exists.' });
    const passwordHash = await bcrypt.hash(password, 12);
    const created = await database.run('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name.trim(), normalizedEmail, passwordHash]);
    const user = await database.get('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [created.id]);
    const token = createToken(user);
    await saveSession(user, token);
    return res.status(201).json({ user: publicUser(user), token });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create account.' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email?.trim() || !password) return res.status(400).json({ message: 'Email and password are required.' });
  try {
    const user = await database.get('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ message: 'Invalid email or password.' });
    const token = createToken(user);
    await saveSession(user, token);
    return res.json({ user: publicUser(user), token });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to sign in.' });
  }
}

async function me(req, res) {
  const user = await database.get('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.sub]);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  return res.json({ user: publicUser(user) });
}

async function logout(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await database.run('DELETE FROM sessions WHERE token_hash = ?', [tokenHash]);
  }
  return res.status(204).send();
}

module.exports = { signUp, login, me, logout };
