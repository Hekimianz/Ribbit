const prisma = require('../config/prismaClient');

exports.getSubs = async (req, res) => {
  const subs = await prisma.subribbit.findMany();
  res.send(subs);
};

exports.getSub = async (req, res) => {
  const { name } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sub = await prisma.subribbit.findUnique({
    where: {
      name,
    },
    include: {
      posts: {
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          createdAt: true,
          title: true,
          image: true,
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
  const totalCount = await prisma.post.count({
    where: {
      subribbit: {
        name,
      },
    },
  });
  res.json({ sub, totalCount });
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
