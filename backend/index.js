const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

app.listen(3001, () => {
  console.log('✅ Backend running at http://localhost:3001');
});
