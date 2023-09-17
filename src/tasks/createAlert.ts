import { SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
import { fastify } from '@root/index';
import { AlertLevel } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { randomLetter } from '@root/utils/randomLetter';

function createRandomAlert(userId) {
  return {
    message: faker.lorem.sentence(),
    level: faker.helpers.arrayElement([
      AlertLevel.LOW,
      AlertLevel.MEDIUM,
      AlertLevel.HIGH,
      AlertLevel.CRITICAL,
    ]),
    user: { connect: { id: userId } },
  };
}

const task = new AsyncTask(
  'create-alert',
  () => {
    return fastify.prisma.user
      .findFirst({
        where: { email: { contains: randomLetter() } },
      })
      .then((user) => {
        fastify.prisma.alert
          .create({
            data: createRandomAlert(user.id),
          })
          .then((alert) => {
            fastify.log.info(`Created alert: ${alert.id}`);
          });
      });
  },
  (err) => {
    fastify.log.error(err);
  }
);

const createAlertJob = new SimpleIntervalJob({ seconds: 15 }, task);

export default createAlertJob;
