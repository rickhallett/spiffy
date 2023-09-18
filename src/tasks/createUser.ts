import { SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
import { fastify, saltRounds } from '@root/index';
import {
  createRandomUser as createRandomUserHelper,
  createRandomRole,
} from '@root/seed-db';
import bcrypt from 'bcrypt';

const createRandomUser = new AsyncTask(
  'create-user',
  () => {
    const user = createRandomUserHelper();
    return bcrypt.hash(user.password, saltRounds).then((hashedPassword) => {
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

const createUserJob = new SimpleIntervalJob({ seconds: 1 }, createRandomUser);

export default createUserJob;
