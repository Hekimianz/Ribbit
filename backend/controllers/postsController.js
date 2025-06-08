const prisma = require('../config/prismaClient');

exports.getAll = async (req, res) => {
  const posts = await prisma.post.findMany({
    select: {
      subribbit: {
        select: {
          id: true,
          name: true,
        },
      },
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      id: true,
      createdAt: true,
      title: true,
      image: true,
    },
  });
  res.send(posts);
};

exports.getUsersPosts = async (req, res) => {
  const { name } = req.params;
  const userId = await prisma.user.findUnique({
    where: { username: name },
    select: {
      id: true,
    },
  });

  const posts = await prisma.post.findMany({
    where: {
      authorId: userId.id,
    },
    include: {
      subribbit: true,
    },
  });
  res.send(posts);
};

exports.getSingle = async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      comments: {
        include: {
          author: {
            select: {
              username: true,
            },
          },
        },
      },
      author: {
        select: {
          username: true,
        },
      },
      subribbit: true,
    },
  });
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.send(post);
};

exports.post = async (req, res) => {
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
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const post = await prisma.post.findUnique({
    where: { id },
  });
  const isAuthor = req.user.id === post.authorId;
  if (isAuthor) {
    await prisma.post.delete({
      where: { id },
    });
    res.send('Delete successful');
  } else {
    res.send('Not authorized to delete that post');
  }
};
