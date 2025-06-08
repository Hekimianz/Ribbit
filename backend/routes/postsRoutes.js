const express = require('express');
const route = express.Router();
const postsController = require('../controllers/postsController');
const { authenticateToken } = require('../middlewares/auth');

route.get('/', postsController.getAll);

route.get('/user/:name', postsController.getUsersPosts);

route.get('/:id', postsController.getSingle);

route.post('/', authenticateToken, postsController.post);

route.delete('/:id', authenticateToken, postsController.delete);

module.exports = route;
