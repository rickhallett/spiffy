import { SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
import { fastify } from '@root/index';
import { Alert, AlertLevel, User } from '@prisma/client';
import { faker } from '@faker-js/faker';

// write a function that returns a random letter
function randomLetter() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const randomIndex = Math.floor(Math.random() * alphabet.length);
  return alphabet[randomIndex];
}

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
            fastify.log.info(
              `Created alert: ${JSON.stringify(alert, null, 2)}`
            );
          });
      });
  },
  (err) => {
    fastify.log.error(err);
  }
);

const createAlertJob = new SimpleIntervalJob({ seconds: 20 }, task);

export default createAlertJob;
