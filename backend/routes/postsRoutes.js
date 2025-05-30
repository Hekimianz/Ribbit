const prisma = require('../config/prismaClient');
const express = require('express');
const route = express.Router();
const { authenticateToken } = require('../middlewares/auth');

route.get('/', async (req, res) => {
  const posts = await prisma.post.findMany();
  res.send(posts);
});

route.get('/:id', async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: { id },
  });
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.send(post);
});

route.post('/', authenticateToken, async (req, res) => {
  const { title, textContent, image, subribbitId } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (!subribbitId) {
    return res.status(400).json({ error: 'subribbitId is required' });
  }

  const sub = await prisma.subribbit.findUnique({
    where: { id: subribbitId },
  });
  if (!sub) {
    return res.status(404).json({ error: 'Subribbit not found' });
  }

  const post = await prisma.post.create({
    data: {
      title,
      textContent,
      image,
      subribbitId,
      authorId: req.user.id,
    },
  });

  res.status(201).json({ message: 'Post created', post });
});

module.exports = route;
