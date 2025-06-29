const commentsController = require('../controllers/commentsController');
const express = require('express');
const route = express.Router();
const { authenticateToken } = require('../middlewares/auth');

// Get all comments by user logged in
route.get('/user/:name', commentsController.getAll);

// Create new comment
route.post('/post/:postId', authenticateToken, commentsController.post);

route.post('/:id/vote', authenticateToken, commentsController.vote);

// Delete comment
route.delete('/:id', authenticateToken, commentsController.delete);

module.exports = route;
