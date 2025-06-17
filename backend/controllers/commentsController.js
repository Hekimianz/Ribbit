const prisma = require('../config/prismaClient');

exports.getAll = async (req, res) => {
  const { name } = req.params;
  const userId = await prisma.user.findUnique({
    where: { username: name },
    select: {
      id: true,
    },
  });

  const comments = await prisma.comment.findMany({
    where: {
      authorId: userId.id,
    },
    select: {
      id: true,
      text: true,
      createdAt: true,
      postId: true,
      votes: true,
    },
  });
  res.status(200).json({ comments });
};

exports.post = async (req, res) => {
  const { text } = req.body;
  const authorId = req.user.id;
  const { postId } = req.params;
  const comment = await prisma.comment.create({
    data: {
      text,
      authorId,
      postId,
    },
  });
  res.status(201).json({ message: 'Comment created', comment });
};

exports.delete = async (req, res) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: req.params.id,
    },
  });
  const isAuthor = req.user.id === comment.authorId;
  if (!isAuthor) {
    res.send('Not authorized to delete that post');
  } else {
    await prisma.comment.delete({
      where: {
        id: req.params.id,
      },
    });
    res.send('Delete successful');
  }
};

exports.vote = async (req, res) => {
  const { id: commentId } = req.params;
  const { value } = req.body;
  const userId = req.user.id;

  if (![1, -1].includes(value))
    return res.status(400).json({ error: 'Invalid vote' });

  const existingVote = await prisma.commentVote.findUnique({
    where: {
      userId_commentId: { userId, commentId },
    },
  });

  if (!existingVote) {
    await prisma.commentVote.create({
      data: { userId, commentId, value },
    });
    return res.status(201).json({ message: 'Voted' });
  }

  if (existingVote.value === value) {
    await prisma.commentVote.delete({
      where: { userId_commentId: { userId, commentId } },
    });
    return res.status(200).json({ message: 'Vote removed' });
  }

  await prisma.commentVote.update({
    where: { userId_commentId: { userId, commentId } },
    data: { value },
  });

  return res.status(200).json({ message: 'Vote updated' });
};
