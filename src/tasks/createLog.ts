import { SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
import { fastify } from '@root/index';
import { faker } from '@faker-js/faker';
import { randomLetter } from '@root/utils/randomLetter';

const createRandomLog = new AsyncTask(
  'create-log',
  () => {
    return fastify.prisma.user
      .findFirst({
        where: { email: { contains: randomLetter() } },
      })
      .then((user) => {
        if (!user) {
          throw new Error('User not found. Log not created.');
        }

        fastify.prisma.log
          .create({
            data: {
              message: faker.lorem.sentence(),
              level: faker.helpers.arrayElement([
                'INFO',
                'WARN',
                'ERROR',
                'DEBUG',
              ]),
              user: { connect: { id: user.id } },
            },
          })
          .then((log) => {
            fastify.log.info(`Created log: ${log.id}`);
          });
      });
  },
  (err) => {
    fastify.log.error(err);
  }
);

const createLogJob = new SimpleIntervalJob({ seconds: 1 }, createRandomLog);

export default createLogJob;
