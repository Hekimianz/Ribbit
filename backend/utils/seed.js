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
  await clearDatabase();

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
      {
        id: '751c0a88-12d2-4321-bcee-09ab98ef0101',
        name: 'javascript',
        description: 'All things JavaScript',
      },
      {
        id: '88cd91a4-ef76-4cfa-88e7-123ffaca1020',
        name: 'frontend',
        description: 'Front-end frameworks and UI talk',
      },
      {
        id: '99be2312-d234-4c45-9a55-cc334112deab',
        name: 'career',
        description: 'Developer career advice and experiences',
      },
    ],
  });

  const posts = [
    {
      title: 'Why I switched from Vue to React',
      textContent: 'Vue was great, but React’s ecosystem just clicked with me.',
      image: null,
    },
    {
      title: 'CSS Grid vs Flexbox: My Experience',
      textContent: 'Grid is perfect for layout, Flexbox shines in components.',
      image: null,
    },
    {
      title: 'Funny meme I saw today',
      textContent: null,
      image: 'https://i.imgur.com/FJQJlps.jpeg',
    },
    {
      title: 'Deploying with Vercel made easy',
      textContent: 'Zero config, fast CI/CD. Not sponsored.',
      image: null,
    },
    {
      title: 'Is TypeScript worth it?',
      textContent: null,
      image: 'https://i.imgur.com/FJQJlps.jpeg',
    },
    {
      title: 'How I broke my production build 😅',
      textContent: 'One missing semicolon cost us 3 hours.',
      image: null,
    },
    {
      title: 'My first open-source contribution',
      textContent: 'PR got merged! Excited to do more.',
      image: null,
    },
    {
      title: 'What’s your favorite JS framework?',
      textContent: null,
      image: 'https://i.imgur.com/FJQJlps.jpeg',
    },
    {
      title: 'Dark mode: Love it or hate it?',
      textContent: 'It’s essential at night but annoying during the day.',
      image: null,
    },
    {
      title: 'Responsive design tips for beginners',
      textContent: 'Use relative units, media queries, and test often.',
      image: null,
    },
    {
      title: 'React hooks I use daily',
      textContent: null,
      image: 'https://i.imgur.com/FJQJlps.jpeg',
    },
    {
      title: 'Building a meme generator app',
      textContent: 'It started as a joke, now I have users.',
      image: 'https://i.imgur.com/FJQJlps.jpeg',
    },
    {
      title: 'Thoughts on Tailwind CSS',
      textContent: 'Utility classes speed things up, but naming can get messy.',
      image: null,
    },
    {
      title: 'Web accessibility basics',
      textContent: 'Start with alt text, labels, and semantic HTML.',
      image: null,
    },
    {
      title: 'How I debug JavaScript bugs',
      textContent: null,
      image: 'https://i.imgur.com/FJQJlps.jpeg',
    },
    {
      title: 'Best free API for testing',
      textContent: 'jsonplaceholder.typicode.com and mockapi.io are great.',
      image: null,
    },
    {
      title: 'Working with Prisma and PostgreSQL',
      textContent: 'The schema-first approach saves time.',
      image: null,
    },
    {
      title: 'Why I stopped using Redux',
      textContent: null,
      image: 'https://i.imgur.com/FJQJlps.jpeg',
    },
    {
      title: 'Silly bug of the day 🐞',
      textContent: 'console.log was inside an infinite loop.',
      image: null,
    },
    {
      title: 'HTML is not a programming language',
      textContent: 'Still, you can build full websites with it.',
      image: null,
    },
  ];

  const subribbitIds = [
    '3f87bc2a-9f3f-4d84-a1c0-fbfb6890ff9a',
    '601c4231-1a92-40fd-a6c3-efa123456789',
    '751c0a88-12d2-4321-bcee-09ab98ef0101',
    '88cd91a4-ef76-4cfa-88e7-123ffaca1020',
    '99be2312-d234-4c45-9a55-cc334112deab',
  ];

  const createdPosts = await Promise.all(
    posts.map((post, i) =>
      prisma.post.create({
        data: {
          title: post.title,
          textContent: post.textContent,
          image: post.image,
          createdAt: new Date(Date.now() - i * 3600 * 1000),
          authorId:
            i % 2 === 0
              ? '1f72c48e-a8f7-4c61-a8d0-17fc6cf3b019'
              : 'ea2cb44d-3c52-4135-8fd5-bb8f9090a2a1',
          subribbitId: subribbitIds[i % subribbitIds.length],
        },
      })
    )
  );

  const commentSamples = [
    'Great post!',
    'Totally agree with you.',
    'This made my day 😂',
    'Could you share more on this?',
    'I had the same experience.',
    'Thanks for the tips!',
    'Not sure I agree, but interesting take.',
    'This was super helpful, thanks!',
    'LOL this is so true!',
    'Nice write-up.',
  ];

  let commentCount = 0;
  for (let i = 0; i < createdPosts.length; i++) {
    const numComments = Math.floor(Math.random() * 3); // 0 to 2 comments per post
    for (let j = 0; j < numComments; j++) {
      await prisma.comment.create({
        data: {
          text: commentSamples[(commentCount + j) % commentSamples.length],
          createdAt: new Date(Date.now() - j * 60000),
          authorId:
            j % 2 === 0
              ? 'ea2cb44d-3c52-4135-8fd5-bb8f9090a2a1'
              : '1f72c48e-a8f7-4c61-a8d0-17fc6cf3b019',
          postId: createdPosts[i].id,
        },
      });
    }
    commentCount++;
  }

  console.log('Seeding completed.');
};

seedDb();
