const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

const JWT_SECRET = 'gizli-anahtar';

// Kullanıcı Kaydı (Signup)
router.post('/signup', (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
    stmt.run(email, hashedPassword);
    res.status(201).json({ message: '✅ Kullanıcı oluşturuldu' });
  } catch (err) {
    res.status(400).json({ error: '❌ Bu e-posta zaten kullanılıyor' });
  }
});

// Kullanıcı Girişi (Login)
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email);

  if (!user) {
    return res.status(401).json({ error: '❌ Kullanıcı bulunamadı' });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ error: '❌ Şifre yanlış' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
