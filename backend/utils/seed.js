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
    const username =
      faker.person.firstName().toLowerCase() +
      faker.number.int({ min: 1, max: 999 });
    users.push(
      await prisma.user.create({
        data: {
          username,
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

  // Subscribe each user to 1–3 subribbits
  for (const user of users) {
    const numSubscriptions = faker.number.int({ min: 1, max: 3 });
    const subsToSubscribe = faker.helpers.arrayElements(
      subribbits,
      numSubscriptions
    );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscribedSubs: {
          connect: subsToSubscribe.map((sub) => ({ id: sub.id })),
        },
      },
    });
  }

  const realisticTitles = [
    'Why I Switched from React to Svelte',
    '10 JavaScript Tricks You Should Know',
    'What It’s Really Like Working at a FAANG Company',
    'CSS Grid vs Flexbox: When to Use Which',
    'The Meme That Perfectly Describes Debugging',
    'Frontend Devs Be Like...',
    'How I Landed My First Dev Job with No Degree',
    'Dark Mode Is Not Just Aesthetic: Here’s Why',
    'This UI Pattern Needs to Die',
    'Interviewed at Google and Here’s What Happened',
  ];

  const realisticBodies = [
    'After working with React for 3 years, I finally gave Svelte a shot — and honestly, I’m not going back anytime soon.',
    'You might’ve been using `Array.map` wrong this whole time. Here’s how to really leverage it.',
    'Honestly, I think we as developers overcomplicate things. Sometimes plain CSS is all you need.',
    'This happened during a live demo in front of my manager. Spoiler: it blue-screened.',
    'This meme is the reason I failed a stand-up. I couldn’t stop laughing.',
    'If you’re struggling to learn JavaScript, here’s the roadmap that finally worked for me.',
    'Honestly, the coding bootcamp was great, but the real learning happened on the job.',
    'Why do we keep designing mobile navs like it’s still 2010?',
    'Dark patterns in UI design are not just unethical — they cost you users.',
    'Imposter syndrome is real. Here’s how I deal with it as a junior dev.',
  ];

  const mockImages = [
    'https://i.imgur.com/FJQJlps.jpeg',
    'https://i.imgur.com/uDPl0K2.jpeg',
    'https://i.imgur.com/2FcQWz8.jpeg',
    'https://i.imgur.com/jxUfxhS.png',
  ];

  const posts = [];

  for (let i = 0; i < 100; i++) {
    const author = faker.helpers.arrayElement(users);
    const sub = faker.helpers.arrayElement(subribbits);
    const title = faker.helpers.arrayElement(realisticTitles);
    const textContent = faker.helpers.arrayElement(realisticBodies);

    let image = null;
    if (sub.name === 'memes' || sub.name === 'frontend') {
      if (faker.datatype.boolean()) {
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
          title,
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
    'This helped clarify a lot. Thanks!',
    'Been there. Debugging sucks sometimes.',
    '🔥🔥🔥',
    'I respectfully disagree, here’s why...',
    'This is gold. Bookmarking for later.',
    'Can confirm — this happened to me too.',
    'How would you handle this in Vue?',
    'Dude. That meme is way too real.',
    'Props to you for breaking it down simply.',
    'We need more posts like this.',
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

  console.log('Database seeded with realistic content.');
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
