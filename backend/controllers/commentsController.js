const prisma = require('../config/prismaClient');

exports.getAll = async (req, res) => {
  const { id } = req.params;
  const comments = await prisma.comment.findMany({
    where: {
      authorId: id,
    },
    select: {
      id: true,
      text: true,
      createdAt: true,
      postId: true,
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
