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

exports.subscribeToSub = async (req, res) => {
  const userId = req.user?.id;
  const { subribbitName } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!subribbitName) {
    return res.status(400).json({ error: 'Missing subribbit name' });
  }

  const subribbit = await prisma.subribbit.findUnique({
    where: { name: subribbitName },
  });

  if (!subribbit) {
    return res.status(404).json({ error: 'Subribbit not found' });
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscribedSubs: {
          connect: { id: subribbit.id },
        },
      },
    });

    res.status(200).json({ message: `Subscribed to ${subribbitName}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

exports.unsubscribeFromSub = async (req, res) => {
  const userId = req.user?.id;
  const { subribbitName } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!subribbitName) {
    return res.status(400).json({ error: 'Missing subribbit name' });
  }

  const subribbit = await prisma.subribbit.findUnique({
    where: { name: subribbitName },
  });

  if (!subribbit) {
    return res.status(404).json({ error: 'Subribbit not found' });
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscribedSubs: {
          disconnect: { id: subribbit.id },
        },
      },
    });

    res.status(200).json({ message: `Unsubscribed from ${subribbitName}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
};

exports.getSubscriptions = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscribedSubs: true,
    },
  });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const subscribedSubNames = user.subscribedSubs.map((sub) => sub.name);
  res.send(subscribedSubNames);
};
