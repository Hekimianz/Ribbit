const express = require('express');
const route = express.Router();
const subController = require('../controllers/subController');
const { authenticateToken } = require('../middlewares/auth');

route.get('/', subController.getSubs);
route.get('/subscriptions', authenticateToken, subController.getSubscriptions);
route.get('/:name', subController.getSub);
route.post('/', authenticateToken, subController.createSub);
route.post('/subscribe', authenticateToken, subController.subscribeToSub);
route.post('/unsubscribe', authenticateToken, subController.unsubscribeFromSub);

module.exports = route;
