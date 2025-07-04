const express = require('express');
const route = express.Router();
const postsController = require('../controllers/postsController');
const { authenticateToken } = require('../middlewares/auth');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

route.get('/', postsController.getAll);

route.get('/user/:name', postsController.getUsersPosts);

route.get(
  '/user/subs/:name',
  authenticateToken,
  postsController.getPostsFromSubs
);

route.get('/:id', postsController.getSingle);

route.post(
  '/',
  authenticateToken,
  upload.single('image'),
  postsController.post
);

route.post('/:id/vote', authenticateToken, postsController.vote);

route.delete('/:id', authenticateToken, postsController.delete);

module.exports = route;
