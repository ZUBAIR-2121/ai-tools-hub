const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');

// GET /api/tools  — list all tools (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { category, type, search, limit = 100, offset = 0 } = req.query;
    let query = `
      SELECT t.*, c.title AS category_title, c.icon AS category_icon, c.color AS category_color
      FROM tools t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE 1=1
    `;
    const params = [];
    if (category) { query += ' AND c.id = ?'; params.push(category); }
    if (type) { query += ' AND t.tool_type = ?'; params.push(type); }
    if (search) { query += ' AND (t.name LIKE ? OR t.description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
    query += ' ORDER BY t.id ASC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));
    const [rows] = await db.query(query, params);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/tools/categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY id ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/tools/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, c.title AS category_title, c.icon AS category_icon
      FROM tools t LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = ?`, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Tool not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/tools/:id/bookmark (protected)
router.post('/:id/bookmark', authMiddleware, async (req, res) => {
  try {
    await db.query(
      'INSERT IGNORE INTO bookmarks (user_id, tool_id) VALUES (?, ?)',
      [req.user.id, req.params.id]
    );
    res.json({ success: true, message: 'Bookmarked' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/tools/:id/bookmark (protected)
router.delete('/:id/bookmark', authMiddleware, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM bookmarks WHERE user_id = ? AND tool_id = ?',
      [req.user.id, req.params.id]
    );
    res.json({ success: true, message: 'Bookmark removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/tools/user/bookmarks (protected)
router.get('/user/bookmarks', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT t.*, c.title AS category_title, c.icon AS category_icon
      FROM bookmarks b
      JOIN tools t ON b.tool_id = t.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE b.user_id = ?`, [req.user.id]);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
