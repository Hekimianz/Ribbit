require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 8000;
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const { authenticateToken } = require('./middlewares/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.get('/', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
