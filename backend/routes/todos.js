const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleWare');

const router = express.Router();

// GET /todos – Kullanıcının görevlerini getir
router.get('/', authMiddleware, (req, res) => {
  const stmt = db.prepare('SELECT * FROM todos WHERE user_id = ?');
  const todos = stmt.all(req.user.userId);
  res.json(todos);
});

// POST /todos – Yeni görev ekle
router.post('/', authMiddleware, (req, res) => {
  const { text } = req.body;
  const stmt = db.prepare('INSERT INTO todos (user_id, text) VALUES (?, ?)');
  const info = stmt.run(req.user.userId, text);
  res.status(201).json({ id: info.lastInsertRowid, text, completed: 0 });
});

// PUT /todos/:id – Görevi güncelle (tamamlanma ve/veya metin)
router.put('/:id', authMiddleware, (req, res) => {
  const { completed, text } = req.body;
  const id = req.params.id;
  const userId = req.user.userId;

  const existing = db.prepare('SELECT * FROM todos WHERE id = ? AND user_id = ?').get(id, userId);
  if (!existing) {
    return res.status(404).json({ error: 'Görev bulunamadı.' });
  }

  const newCompleted = typeof completed === 'number' ? completed : existing.completed;
  const newText = typeof text === 'string' ? text : existing.text;

  const stmt = db.prepare('UPDATE todos SET completed = ?, text = ? WHERE id = ? AND user_id = ?');
  stmt.run(newCompleted, newText, id, userId);

  res.json({ message: 'Görev güncellendi.' });
});

// DELETE /todos/:id – Görev sil
router.delete('/:id', authMiddleware, (req, res) => {
  const stmt = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?');
  stmt.run(req.params.id, req.user.userId);
  res.json({ message: 'Görev silindi.' });
});

module.exports = router;
