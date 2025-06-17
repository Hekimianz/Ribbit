const prisma = require('../config/prismaClient');

exports.getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const { search } = req.query;
  console.log(search);
  const limit = parseInt(req.query.limit) || 10;
  const whereClause = search
    ? {
        title: {
          contains: search,
          mode: 'insensitive', // case-insensitive search
        },
      }
    : {};
  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
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
        votes: true,
      },
    }),
    prisma.post.count({
      where: whereClause,
    }),
  ]);

  res.json({ posts, totalCount });
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
      votes: true,
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
          author: { select: { username: true } },
          votes: true,
        },
      },
      author: { select: { username: true } },
      subribbit: true,
      votes: true,
    },
  });
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.send(post);
};

exports.post = async (req, res) => {
  const { title, textContent, subribbitId } = req.body;

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

  let imageUrl = null;
  let imagePublicId = null;

  if (req.file) {
    imageUrl = req.file.path;
    imagePublicId = req.file.filename;
  }

  const post = await prisma.post.create({
    data: {
      title,
      textContent,
      image: imageUrl,
      imagePublicId,
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

exports.vote = async (req, res) => {
  const { id: postId } = req.params;
  const { value } = req.body;
  const userId = req.user.id;

  if (![1, -1].includes(value))
    return res.status(400).json({ error: 'Invalid vote' });

  const existingVote = await prisma.postVote.findUnique({
    where: {
      userId_postId: { userId, postId },
    },
  });

  if (!existingVote) {
    await prisma.postVote.create({
      data: { userId, postId, value },
    });
    return res.status(201).json({ message: 'Voted' });
  }

  if (existingVote.value === value) {
    await prisma.postVote.delete({
      where: { userId_postId: { userId, postId } },
    });
    return res.status(200).json({ message: 'Vote removed' });
  }

  await prisma.postVote.update({
    where: { userId_postId: { userId, postId } },
    data: { value },
  });

  return res.status(200).json({ message: 'Vote updated' });
};
