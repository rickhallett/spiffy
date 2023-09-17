import { SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
import { fastify } from '@root/index';
import {
  createRandomUser as createRandomUserHelper,
  createRandomRole,
} from '@root/seed-db';

const createRandomUser = new AsyncTask(
  'create-user',
  () => {
    const user = createRandomUserHelper();
    return fastify.bcrypt.hash(user.password).then((hashedPassword) => {
      fastify.prisma.user
        .create({
          data: {
            email: user.email,
            password: hashedPassword,
            roles: { create: { name: createRandomRole() } },
          },
        })
        .then((user) => {
          fastify.log.info(`Created user: ${user.id}`);
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  },
  (err) => {
    fastify.log.error(err);
  }
);

const createUserJob = new SimpleIntervalJob({ seconds: 21 }, createRandomUser);

export default createUserJob;
