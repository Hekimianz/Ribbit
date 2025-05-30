const express = require('express');
const route = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');

route.post('/login', authController.login);
route.post('/register', authController.register);
route.post('/logout', authController.logout);

route.get('/verify-token', authenticateToken, async (req, res) => {
  // Simulate latency
  //   await new Promise((resolve) => setTimeout(resolve, 100));
  res.json(req.user);
});

module.exports = route;
