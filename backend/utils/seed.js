const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function clearDatabase() {
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.subribbit.deleteMany();
  await prisma.user.deleteMany();
  console.log('Database cleared.');
}

async function seed() {
  await clearDatabase();

  const userCount = 10;
  const users = [];
  for (let i = 0; i < userCount; i++) {
    users.push(
      await prisma.user.create({
        data: {
          username: faker.internet.userName().toLowerCase(),
          password: 'monkey',
        },
      })
    );
  }

  const subNames = ['webdev', 'memes', 'javascript', 'frontend', 'career'];
  const subDescriptions = [
    'A place to discuss web development',
    'Post your funniest memes here',
    'All things JavaScript',
    'Front-end frameworks and UI talk',
    'Developer career advice and experiences',
  ];

  const subribbits = [];
  for (let i = 0; i < subNames.length; i++) {
    subribbits.push(
      await prisma.subribbit.create({
        data: {
          name: subNames[i],
          description: subDescriptions[i],
        },
      })
    );
  }

  const posts = [];
  for (let i = 0; i < 100; i++) {
    const author = faker.helpers.arrayElement(users);
    const sub = faker.helpers.arrayElement(subribbits);

    let textContent = faker.lorem.sentences(
      faker.number.int({ min: 1, max: 3 })
    );
    let image = null;

    if (sub.name === 'memes' || sub.name === 'frontend') {
      if (faker.datatype.boolean()) {
        const mockImages = [
          'https://i.imgur.com/FJQJlps.jpeg',
          'https://i.imgur.com/uDPl0K2.jpeg',
          'https://i.imgur.com/2FcQWz8.jpeg',
          'https://i.imgur.com/jxUfxhS.png',
        ];
        image = faker.helpers.arrayElement(mockImages);
      }
    } else {
      if (faker.datatype.boolean()) {
        image = `https://picsum.photos/seed/${faker.string.alphanumeric(
          10
        )}/600/400`;
      }
    }

    posts.push(
      await prisma.post.create({
        data: {
          title: faker.lorem.sentence(),
          textContent,
          image,
          authorId: author.id,
          subribbitId: sub.id,
          createdAt: faker.date.recent({ days: 30 }),
        },
      })
    );
  }

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

  for (const post of posts) {
    const numComments = faker.number.int({ min: 0, max: 5 });
    const postAuthorId = post.authorId;
    for (let i = 0; i < numComments; i++) {
      let commenter;
      do {
        commenter = faker.helpers.arrayElement(users);
      } while (commenter.id === postAuthorId);

      await prisma.comment.create({
        data: {
          text: faker.helpers.arrayElement(commentSamples),
          createdAt: faker.date.recent({ days: 10 }),
          authorId: commenter.id,
          postId: post.id,
        },
      });
    }
  }

  console.log('Database seeded.');
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
