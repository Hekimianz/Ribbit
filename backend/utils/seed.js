const prisma = require('../config/prismaClient');

async function clearDatabase() {
  try {
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.subribbit.deleteMany();
    await prisma.user.deleteMany();
    console.log('Database cleared.');
  } catch (e) {
    console.error('Error clearing database:', e);
  } finally {
    await prisma.$disconnect();
  }
}

const seedDb = async () => {
  // clear data
  await clearDatabase();

  // create users
  await prisma.user.createMany({
    data: [
      {
        id: '1f72c48e-a8f7-4c61-a8d0-17fc6cf3b019',
        username: 'bob',
        password: 'monkey',
      },
      {
        id: 'ea2cb44d-3c52-4135-8fd5-bb8f9090a2a1',
        username: 'jill',
        password: 'monkey',
      },
    ],
  });

  // create subribbits
  await prisma.subribbit.createMany({
    data: [
      {
        id: '3f87bc2a-9f3f-4d84-a1c0-fbfb6890ff9a',
        name: 'webdev',
        description: 'A place to discuss web development',
      },
      {
        id: '601c4231-1a92-40fd-a6c3-efa123456789',
        name: 'memes',
        description: 'Post your funniest memes here',
      },
    ],
  });

  // create posts
  await prisma.post.createMany({
    data: [
      {
        id: 'abc12345-6789-4def-b012-3456789abcde',
        createdAt: '2025-05-30T12:00:00.000Z',
        title: 'Just finished my first React app!',
        textContent: 'Let me know what you think.',
        image: null,
        authorId: '1f72c48e-a8f7-4c61-a8d0-17fc6cf3b019',
        subribbitId: '3f87bc2a-9f3f-4d84-a1c0-fbfb6890ff9a',
      },
      {
        id: 'def67890-1234-4abc-bcde-456789abcdef',
        createdAt: '2025-05-30T13:30:00.000Z',
        title: 'This meme sums up my day',
        textContent: null,
        image: 'https://i.imgur.com/FJQJlps.jpeg',
        authorId: 'ea2cb44d-3c52-4135-8fd5-bb8f9090a2a1',
        subribbitId: '601c4231-1a92-40fd-a6c3-efa123456789',
      },
    ],
  });

  // create comments
  await prisma.comment.createMany({
    data: [
      {
        id: 'c1e1d9a0-7f91-4c2d-b6c3-1a2b3c4d5e6f',
        text: 'Nice work, Bob!',
        createdAt: '2025-05-30T14:00:00.000Z',
        authorId: 'ea2cb44d-3c52-4135-8fd5-bb8f9090a2a1',
        postId: 'abc12345-6789-4def-b012-3456789abcde',
      },
      {
        id: 'd4f7b8e1-2a43-4f0a-96b4-7e3b9ef81234',
        text: 'This cracked me up 😂',
        createdAt: '2025-05-30T14:30:00.000Z',
        authorId: '1f72c48e-a8f7-4c61-a8d0-17fc6cf3b019',
        postId: 'def67890-1234-4abc-bcde-456789abcdef',
      },
    ],
  });
};

seedDb();

// {
//   "users": [
//     {
//       "id": "1f72c48e-a8f7-4c61-a8d0-17fc6cf3b019",
//       "username": "bob",
//       "password": "$2b$10$hashedpassword1"
//     },
//     {
//       "id": "ea2cb44d-3c52-4135-8fd5-bb8f9090a2a1",
//       "username": "jill",
//       "password": "$2b$10$hashedpassword2"
//     }
//   ],
//   "subribbits": [
//     {
//       "id": "3f87bc2a-9f3f-4d84-a1c0-fbfb6890ff9a",
//       "name": "webdev",
//       "description": "A place to discuss web development"
//     },
//     {
//       "id": "601c4231-1a92-40fd-a6c3-efa123456789",
//       "name": "memes",
//       "description": "Post your funniest memes here"
//     }
//   ],
//   "posts": [
//     {
//       "id": "abc12345-6789-4def-b012-3456789abcde",
//       "createdAt": "2025-05-30T12:00:00.000Z",
//       "title": "Just finished my first React app!",
//       "textContent": "Let me know what you think.",
//       "image": null,
//       "authorId": "1f72c48e-a8f7-4c61-a8d0-17fc6cf3b019",
//       "subribbitId": "3f87bc2a-9f3f-4d84-a1c0-fbfb6890ff9a"
//     },
//     {
//       "id": "def67890-1234-4abc-bcde-456789abcdef",
//       "createdAt": "2025-05-30T13:30:00.000Z",
//       "title": "This meme sums up my day",
//       "textContent": null,
//       "image": "https://i.imgur.com/funny-meme.jpg",
//       "authorId": "ea2cb44d-3c52-4135-8fd5-bb8f9090a2a1",
//       "subribbitId": "601c4231-1a92-40fd-a6c3-efa123456789"
//     }
//   ],
//   "comments": [
//     {
//       "id": "c1e1d9a0-7f91-4c2d-b6c3-1a2b3c4d5e6f",
//       "text": "Nice work, Bob!",
//       "createdAt": "2025-05-30T14:00:00.000Z",
//       "authorId": "ea2cb44d-3c52-4135-8fd5-bb8f9090a2a1",
//       "postId": "abc12345-6789-4def-b012-3456789abcde"
//     },
//     {
//       "id": "d4f7b8e1-2a43-4f0a-96b4-7e3b9ef81234",
//       "text": "This cracked me up 😂",
//       "createdAt": "2025-05-30T14:30:00.000Z",
//       "authorId": "1f72c48e-a8f7-4c61-a8d0-17fc6cf3b019",
//       "postId": "def67890-1234-4abc-bcde-456789abcdef"
//     }
//   ]
// }
