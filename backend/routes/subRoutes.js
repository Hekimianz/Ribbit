const express = require('express');
const route = express.Router();
const subController = require('../controllers/subController');
const { authenticateToken } = require('../middlewares/auth');

route.get('/', subController.getSubs);
route.get('/:name', subController.getSub);
route.post('/', authenticateToken, subController.createSub);

module.exports = route;
