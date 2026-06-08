const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();

// POST /api/auth/register
router.post('/register', [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 chars'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('full_name').optional().trim().isLength({ max: 100 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const { username, email, password, full_name } = req.body;
  try {
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email or username already taken' });
    }
    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password, salt);
    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash, full_name) VALUES (?, ?, ?, ?)',
      [username, email, password_hash, full_name || null]
    );
    const token = jwt.sign({ id: result.insertId, username, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: { id: result.insertId, username, email, full_name: full_name || null },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        bio: user.bio,
        avatar_url: user.avatar_url,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/auth/me  (protected)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, email, full_name, bio, avatar_url, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/auth/profile  (protected)
router.put('/profile', authMiddleware, [
  body('full_name').optional().trim().isLength({ max: 100 }),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('username').optional().trim().isLength({ min: 3, max: 50 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const { full_name, bio, username } = req.body;
  try {
    if (username) {
      const [exists] = await db.query(
        'SELECT id FROM users WHERE username = ? AND id != ?',
        [username, req.user.id]
      );
      if (exists.length > 0) {
        return res.status(409).json({ success: false, message: 'Username already taken' });
      }
    }
    await db.query(
      'UPDATE users SET full_name = COALESCE(?, full_name), bio = COALESCE(?, bio), username = COALESCE(?, username) WHERE id = ?',
      [full_name || null, bio || null, username || null, req.user.id]
    );
    const [rows] = await db.query(
      'SELECT id, username, email, full_name, bio, avatar_url, role FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json({ success: true, message: 'Profile updated', user: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/auth/change-password (protected)
router.put('/change-password', authMiddleware, [
  body('current_password').notEmpty(),
  body('new_password').isLength({ min: 6 }),
], async (req, res) => {
  const { current_password, new_password } = req.body;
  try {
    const [rows] = await db.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    const isMatch = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(new_password, salt);
    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.user.id]);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
