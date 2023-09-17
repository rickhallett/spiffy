import { SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
import { fastify } from '@root/index';
import { faker } from '@faker-js/faker';
import { randomLetter } from '@root/utils/randomLetter';
import { IncidentStatus, AlertLevel, Alert } from '@prisma/client';

function createRandomAlert(userId: string) {
  return {
    message: faker.lorem.sentence(),
    level: faker.helpers.arrayElement([
      AlertLevel.LOW,
      AlertLevel.MEDIUM,
      AlertLevel.HIGH,
      AlertLevel.CRITICAL,
    ]) as AlertLevel,
    userId,
  } as Alert;
}

function createRandomIncidentHelper(userId: string) {
  return {
    title: faker.lorem.sentence(),
    status: faker.helpers.arrayElement([
      IncidentStatus.OPEN,
      IncidentStatus.IN_PROGRESS,
      IncidentStatus.RESOLVED,
      IncidentStatus.CLOSED,
    ]) as IncidentStatus,
    alerts: { create: createRandomAlert(userId) },
    userId,
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
          throw new Error('User not found. Incident not created.');
        }

        fastify.prisma.incident
          .create({
            data: createRandomIncidentHelper(user.id),
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
  { seconds: 18 },
  createRandomIncident
);

export default createIncidentJob;
