const prisma = require('../config/prismaClient');

exports.getSubs = async (req, res) => {
  const subs = await prisma.subribbit.findMany();
  res.send(subs);
};

exports.getSub = async (req, res) => {
  const { name } = req.params;
  const sub = await prisma.subribbit.findUnique({
    where: {
      name,
    },
    include: {
      posts: {
        select: {
          id: true,
          createdAt: true,
          title: true,
          author: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
  });
  if (!sub) {
    res.status(404).json({ error: 'Subribbit does not exist!' });
  }
  res.send(sub);
};

exports.createSub = async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    res.status(400).json({
      error: 'Name and description are required to create a subribbit.',
    });
  }
  const newSub = await prisma.subribbit.create({
    data: {
      name,
      description,
    },
  });
  res.status(201).json({ newSub });
};
