import { PrismaClient } from '@prisma/client';
import Fastify from 'fastify';
import { nanoid } from 'nanoid';

const fastify = Fastify({ logger: true });
const db = new PrismaClient({ log: ['error', 'info', 'query', 'query'] });
const genId = () => nanoid(16);

const seedData = async () => {
  if ((await db.post.count()) === 0)
    return await Promise.all([
      db.post.create({
        data: {
          id: genId(),
          slug: 'ultimate-node-stack',
          title: 'The ultimate Node/Dev Stack',
        },
      }),
      db.post.create({
        data: {
          id: genId(),
          slug: 'future-blog-post',
          title: 'Future Blog Post',
        },
      }),
    ]);
};
seedData();

fastify.get('/', async () => {
  return db.post.findMany();
});

const port = process.env.PORT || 8080;
const start = async () => {
  try {
    await fastify.listen(port, '0.0.0.0');
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
