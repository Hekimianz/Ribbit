require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 8000;
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const postsRoutes = require('./routes/postsRoutes');
const commentRoutes = require('./routes/commentsRoutes');
const subRoutes = require('./routes/subRoutes');
const { authenticateToken } = require('./middlewares/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);
app.use('/comments', commentRoutes);
app.use('/subs', subRoutes);

app.get('/', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
