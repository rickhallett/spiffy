// create a task that creates an incident every 20 seconds and links it to a random user, similarly to createAlert.ts

import { SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
import { fastify } from '@root/index';
import { faker } from '@faker-js/faker';
import { randomLetter } from '@root/utils/randomLetter';
import { Incident, IncidentStatus, AlertLevel } from '@prisma/client';

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

function createRandomIncidentHelper(userId) {
  return {
    title: faker.lorem.sentence(),
    status: faker.helpers.arrayElement([
      IncidentStatus.OPEN,
      IncidentStatus.IN_PROGRESS,
      IncidentStatus.RESOLVED,
      IncidentStatus.CLOSED,
    ]),
    alerts: createRandomAlert(userId),
    user: { connect: { id: userId } },
  };
}

const createRandomIncident = new AsyncTask(
  'create-incident',
  () => {
    return fastify.prisma.user
      .findFirst({
        where: { email: { contains: randomLetter() } },
      })
      .then((user) => {
        if (!user) {
          throw new Error('User not found');
        }

        fastify.prisma.incident
          .create({
            data: createRandomIncidentHelper(user.id) as any,
          })
          .then((incident) => {
            fastify.log.info(`Created incident: ${incident.id}`);
          });
      });
  },
  (err) => {
    fastify.log.error(err);
  }
);

const createIncidentJob = new SimpleIntervalJob(
  { seconds: 20 },
  createRandomIncident
);

export default createIncidentJob;
