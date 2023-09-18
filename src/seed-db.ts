import { fastify, saltRounds } from '@root/index';
import { fa, faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
// import {
//   AlertLevel,
//   IncidentStatus,
//   LogLevel,
//   VulnerabilitySeverity,
//   type RoleType,
// } from '@prisma/client';

enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

enum AlertLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

enum IncidentStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

enum VulnerabilitySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

enum AssetType {
  SERVER = 'SERVER',
  WORKSTATION = 'WORKSTATION',
  NETWORK_DEVICE = 'NETWORK_DEVICE',
  OTHER = 'OTHER',
}

enum RoleType {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPERADMIN = 'SUPERADMIN',
  GUEST = 'GUEST',
}

// User model to store information about users
interface User {
  id: string;
  email: string;
  password: string;
  roles: Role[];
  logs: Log[];
  alerts: Alert[];
  incidents: Incident[];
}

// Role model to store different roles a user can have
type Role = {
  name: RoleType;
  user: User;
};

type Log = {
  message: string;
  level: LogLevel;
};

// Alert model to store alerts
type Alert = {
  message: string;
  level: AlertLevel;
  incident?: Incident;
};

// Incident model to store cybersecurity incidents
type Incident = {
  title: string;
  status: IncidentStatus;
  alerts: Alert[];
};

// Vulnerability model to store known vulnerabilities
type Vulnerability = {
  name: string;
  description: string;
  severity: VulnerabilitySeverity;
  incidents: Incident[];
};

// Asset model to store assets like servers, workstations, etc.
type Asset = {
  name: string;
  type: AssetType;
  configuration: Configuration[];
};

// Configuration model to store system configurations
type Configuration = {
  name: string;
  value: string;
  asset: Asset;
  assetId: string;
};

function createRandomLog() {
  return {
    message: faker.lorem.sentence(),
    level: faker.helpers.arrayElement([
      LogLevel.INFO,
      LogLevel.WARN,
      LogLevel.ERROR,
      LogLevel.DEBUG,
    ]),
  } as Log;
}

export function createRandomIncident() {
  return {
    title: faker.lorem.sentence(),
    status: faker.helpers.arrayElement([
      IncidentStatus.OPEN,
      IncidentStatus.IN_PROGRESS,
      IncidentStatus.RESOLVED,
      IncidentStatus.CLOSED,
    ]),
    alerts: faker.helpers.multiple(createRandomAlert, { count: 3 }),
  } as Incident;
}

function createRandomAlert() {
  return {
    message: faker.lorem.sentence(),
    level: faker.helpers.arrayElement([
      AlertLevel.LOW,
      AlertLevel.MEDIUM,
      AlertLevel.HIGH,
      AlertLevel.CRITICAL,
    ]),
    // user: { connect: { id: userId } },
    // Incident: createRandomIncident(),
  } as Alert;
}

function createRandomVulnerability() {
  return {
    name: faker.lorem.sentence(),
    description: faker.lorem.sentence(),
    severity: faker.helpers.arrayElement([
      VulnerabilitySeverity.LOW,
      VulnerabilitySeverity.MEDIUM,
      VulnerabilitySeverity.HIGH,
      VulnerabilitySeverity.CRITICAL,
    ]),
    incidents: faker.helpers.multiple(createRandomIncident, { count: 3 }),
  } as Vulnerability;
}

function createRandomConfiguration() {
  return {
    name: faker.lorem.sentence(),
    value: faker.lorem.sentence(),
    asset: createRandomAsset(),
  } as Configuration;
}

function createRandomAsset() {
  return {
    name: faker.lorem.sentence(),
    type: faker.helpers.arrayElement([
      AssetType.SERVER,
      AssetType.WORKSTATION,
      AssetType.NETWORK_DEVICE,
      AssetType.OTHER,
    ]),
    // Configuration: createRandomConfiguration(),
  };
}

export function createRandomRole() {
  return faker.helpers.arrayElement([
    RoleType.ADMIN,
    RoleType.GUEST,
    RoleType.SUPERADMIN,
    RoleType.USER,
  ]);
}

export function createRandomUser() {
  return {
    email: faker.internet.email(),
    password: faker.internet.password({ length: 21 }),
    roles: createRandomRole(),
    logs: faker.helpers.multiple(createRandomLog, { count: 10 }),
    alerts: faker.helpers.multiple(createRandomAlert, { count: 3 }),
  };
}

const users = faker.helpers.multiple(createRandomUser, { count: 100 });
const roles = faker.helpers.multiple(createRandomRole, { count: 4 });
const configurations = faker.helpers.multiple(createRandomConfiguration, {
  count: 100,
});
const assets = faker.helpers.multiple(createRandomAsset, { count: 100 });
const vulnerabilities = faker.helpers.multiple(createRandomVulnerability, {
  count: 100,
});
const logs = faker.helpers.multiple(createRandomLog, { count: 100 });
const incidents = faker.helpers.multiple(createRandomIncident, { count: 100 });

export async function seedUsers() {
  let count = 0;
  for (const user of users) {
    await fastify.prisma.user.create({
      data: {
        email: user.email,
        password: await bcrypt.hash(user.password, saltRounds),
        roles: { create: { name: createRandomRole() } },
        logs: {
          create: {
            message: logs[count].message,
            level: logs[count].level as any,
          },
        },
      },
    });
    count++;
    console.log(`Created user ${count} of ${users.length}`);
  }
}

export async function seedLogs() {
  let count = 0;
  for (const log of logs) {
    const users = await fastify.prisma.user.findMany({
      where: { email: { contains: 'e' } },
    });

    await fastify.prisma.log.create({
      data: {
        message: log.message,
        level: log.level as any,
        user: { connect: { id: users[count].id } },
      },
    });
    count++;
    console.log(`Created log ${count} of ${logs.length}`);
  }
}

export async function seedAssets() {
  let count = 0;
  for (const asset of assets) {
    await fastify.prisma.asset.create({
      data: {
        name: asset.name,
        type: asset.type as any,
        // configuration: { create: createRandomConfiguration() as never },
      },
    });
    count++;
    console.log(`Created asset ${count} of ${assets.length}`);
  }
}

export async function seedConfigurations() {
  let count = 0;
  for (const configuration of configurations) {
    const assets = await fastify.prisma.asset.findMany();

    await fastify.prisma.configuration.create({
      data: {
        name: configuration.name,
        value: configuration.value,
        asset: { connect: { id: assets[count].id } },
      },
    });
    count++;
    console.log(`Created configuration ${count} of ${configurations.length}`);
  }
}

export async function seedRoles() {
  let count = 0;
  const users = await fastify.prisma.user.findMany({ take: 4 });
  for (const role of [
    RoleType.ADMIN,
    RoleType.GUEST,
    RoleType.SUPERADMIN,
    RoleType.USER,
  ]) {
    await fastify.prisma.role.create({
      data: {
        name: role,
        user: { connect: { id: users[count].id } },
      },
    });
    count++;
    console.log(`Created role ${count} of ${roles.length}`);
  }
}

export async function linkUsersToRole() {
  const users = await fastify.prisma.user.findMany();
  const roles = await fastify.prisma.role.findMany();

  let count = 0;

  for (const user of users) {
    await fastify.prisma.user.update({
      where: { id: user.id },
      data: {
        roles: {
          connect: {
            id: roles[faker.helpers.rangeToNumber({ min: 0, max: 3 })].id,
          },
        },
      },
    });
    count++;
    console.log(`Linked user ${count} of ${users.length}`);
  }
}

export async function seedIncidents() {
  const users = await fastify.prisma.user.findMany();
  let count = 0;
  for (const incident of incidents) {
    await fastify.prisma.incident.create({
      data: {
        user: { connect: { id: users[count].id } },
        title: incident.title,
        status: incident.status as any,
        // alerts: { create: createRandomAlert(users[count].id) as any },
      },
    });
    count++;
    console.log(`Created incident ${count} of ${incidents.length}`);
  }
}
