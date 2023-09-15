import Fastify, { FastifyInstance } from 'fastify';
import { getPing } from './routes/utils/getPing';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import autoLoad from '@fastify/autoload';
import { join } from 'path';
import fastifySwaggerUIPlugin from './lib/spec/swagger/html';
import 'dotenv/config';
import { register } from './routes/auth/register';
import { home } from './routes/home/home';
import { login } from './routes/auth/login';
import { root } from './routes/root';
import { me } from './routes/user/me';
import crud from 'fastify-crud-generator';
import { writeFileSync, openSync, closeSync, writeFile } from 'fs';
// const blippPlugin = require('fastify-blipp');
// import blippPlugin from "fastify-blipp";
import { fastifyBcrypt } from 'fastify-bcrypt';

const fastify: FastifyInstance = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

fastify.register(import('fastify-markdown'), { data: true });
fastify.register(import('fastify-blipp'));
fastify.register(fastifyBcrypt, {
  saltWorkFactor: 12,
});

// Plugins
fastify.register(autoLoad, {
  dir: join(__dirname, 'plugins'),
});

fastify.register(fastifySwaggerUIPlugin);

// Routes
fastify.register(getPing);
fastify.register(me);
fastify.register(register);
fastify.register(login);
fastify.register(home);
fastify.register(root);

// TODO: encapsulate crud routes into system of plugins
fastify
  .register(crud, {
    prefix: '/api/v1/user',
    controller: {
      list: async (req, reply) => {
        const users = await fastify.prisma.user.findMany({
          include: { roles: true },
        });

        if (!users) {
          return reply.status(400).send('Users not found');
        }

        return reply.status(200).send(users);
      },
      create: async (req, reply) => {
        const user = await fastify.prisma.user.create({
          data: {
            email: req.body.email,
            password: await fastify.bcrypt.hash(req.body.password),
            roles: { create: { name: req.body.role } },
          },
        });

        if (!user) {
          return reply.status(400).send('User not created');
        }

        return reply.status(200).send(user);
      },
      view: async (req, reply) => {
        const user = await fastify.prisma.user.findUnique({
          where: { id: req.params.id as string },
          include: { roles: true },
        });

        if (!user) {
          return reply.status(400).send('User not found');
        }

        return reply.status(200).send(user);
      },
      update: async (req, reply) => {
        const email = req.body.email;
        const password = req.body.password;
        const role = req.body.role;

        if (email) {
          const user = await fastify.prisma.user.update({
            where: { id: req.params.id as string },
            data: {
              email: email,
            },
          });

          if (!user) {
            return reply.status(400).send('User email not updated');
          }

          reply.status(200).send(user);
        }

        if (password) {
          const user = await fastify.prisma.user.update({
            where: { id: req.params.id as string },
            data: {
              password: password,
            },
          });

          if (!user) {
            return reply.status(400).send('User password not updated');
          }

          reply.status(200).send(user);
        }

        if (role) {
          const user = await fastify.prisma.user.update({
            where: { id: req.params.id as string },
            data: {
              roles: { create: { name: role } },
            },
          });

          if (!user) {
            return reply.status(400).send('User role not updated');
          }

          reply.status(200).send(user);
        }
      },
      delete: async (req, reply) => {
        const user = await fastify.prisma.user.delete({
          where: { id: req.params.id as string },
        });

        if (!user) {
          return reply.status(400).send('User not deleted');
        }

        return reply.status(200).send(user);
      },
    },
  })
  .register(crud, {
    prefix: '/api/v1/log',
    controller: {
      list: async (req, reply) => {
        const logs = await fastify.prisma.log.findMany();

        if (!logs) {
          return reply.status(400).send('Logs not found');
        }

        return reply.status(200).send(logs);
      },
      create: async (req, reply) => {
        const log = await fastify.prisma.log.create({
          data: {
            message: req.body.message,
            level: req.body.level,
            user: { connect: { id: req.body.userId } },
          },
        });

        if (!log) {
          return reply.status(400).send('Log not created');
        }

        return reply.status(200).send(log);
      },
      view: async (req, reply) => {
        const log = await fastify.prisma.log.findUnique({
          where: { id: req.params.id as string },
        });

        if (!log) {
          return reply.status(400).send('Log not found');
        }

        return reply.status(200).send(log);
      },
      update: async (req, reply) => {
        const log = await fastify.prisma.log.update({
          where: { id: req.params.id as string },
          data: {
            message: req.body.message,
            level: req.body.level,
            user: { connect: { id: req.body.userId } },
          },
        });

        if (!log) {
          return reply.status(400).send('Log not updated');
        }

        return reply.status(200).send(log);
      },
      delete: async (req, reply) => {
        const log = await fastify.prisma.log.delete({
          where: { id: req.params.id as string },
        });

        if (!log) {
          return reply.status(400).send('Log not deleted');
        }

        return reply.status(200).send(log);
      },
    },
  })
  .register(crud, {
    prefix: '/api/v1/alert',
    controller: {
      list: async (req, reply) => {
        const alerts = await fastify.prisma.alert.findMany();

        if (!alerts) {
          return reply.status(400).send('Alerts not found');
        }

        return reply.status(200).send(alerts);
      },
      create: async (req, reply) => {
        const alert = await fastify.prisma.alert.create({
          data: {
            message: req.body.message,
            level: req.body.level,
            user: { connect: { id: req.body.userId } },
          },
        });

        if (!alert) {
          return reply.status(400).send('Alert not created');
        }

        return reply.status(200).send(alert);
      },
      view: async (req, reply) => {
        const alert = await fastify.prisma.alert.findUnique({
          where: { id: req.params.id as string },
        });

        if (!alert) {
          return reply.status(400).send('Alert not found');
        }

        return reply.status(200).send(alert);
      },
      update: async (req, reply) => {
        const alert = await fastify.prisma.alert.update({
          where: { id: req.params.id as string },
          data: {
            message: req.body.message,
            level: req.body.level,
            user: { connect: { id: req.body.userId } },
          },
        });

        if (!alert) {
          return reply.status(400).send('Alert not updated');
        }

        return reply.status(200).send(alert);
      },
      delete: async (req, reply) => {
        const alert = await fastify.prisma.alert.delete({
          where: { id: req.params.id as string },
        });

        if (!alert) {
          return reply.status(400).send('Alert not deleted');
        }

        return reply.status(200).send(alert);
      },
    },
  })
  .register(crud, {
    prefix: '/api/v1/incident',
    controller: {
      list: async (req, reply) => {
        const incidents = await fastify.prisma.incident.findMany();

        if (!incidents) {
          return reply.status(400).send('Incidents not found');
        }

        return reply.status(200).send(incidents);
      },
      create: async (req, reply) => {
        const incident = await fastify.prisma.incident.create({
          data: {
            title: req.body.title,
            status: req.body.status,
            user: { connect: { id: req.body.userId } },
          },
        });

        if (!incident) {
          return reply.status(400).send('Incident not created');
        }

        return reply.status(200).send(incident);
      },
      view: async (req, reply) => {
        const incident = await fastify.prisma.incident.findUnique({
          where: { id: req.params.id as string },
        });

        if (!incident) {
          return reply.status(400).send('Incident not found');
        }

        return reply.status(200).send(incident);
      },
      update: async (req, reply) => {
        const incident = await fastify.prisma.incident.update({
          where: { id: req.params.id as string },
          data: {
            title: req.body.title,
            status: req.body.status,
            user: { connect: { id: req.body.userId } },
          },
        });

        if (!incident) {
          return reply.status(400).send('Incident not updated');
        }

        return reply.status(200).send(incident);
      },
      delete: async (req, reply) => {
        const incident = await fastify.prisma.incident.delete({
          where: { id: req.params.id as string },
        });

        if (!incident) {
          return reply.status(400).send('Incident not deleted');
        }

        return reply.status(200).send(incident);
      },
    },
  })
  .register(crud, {
    prefix: '/api/v1/vulnerability',
    controller: {
      list: async (req, reply) => {
        const vulnerabilities = await fastify.prisma.vulnerability.findMany();

        if (!vulnerabilities) {
          return reply.status(400).send('Vulnerabilities not found');
        }

        return reply.status(200).send(vulnerabilities);
      },
      create: async (req, reply) => {
        const vulnerability = await fastify.prisma.vulnerability.create({
          data: {
            name: req.body.name,
            description: req.body.description,
            severity: req.body.severity,
          },
        });

        if (!vulnerability) {
          return reply.status(400).send('Vulnerability not created');
        }

        return reply.status(200).send(vulnerability);
      },
      view: async (req, reply) => {
        const vulnerability = await fastify.prisma.vulnerability.findUnique({
          where: { id: req.params.id as string },
        });

        if (!vulnerability) {
          return reply.status(400).send('Vulnerability not found');
        }

        return reply.status(200).send(vulnerability);
      },
      update: async (req, reply) => {
        const vulnerability = await fastify.prisma.vulnerability.update({
          where: { id: req.params.id as string },
          data: {
            name: req.body.name,
            description: req.body.description,
            severity: req.body.severity,
          },
        });

        if (!vulnerability) {
          return reply.status(400).send('Vulnerability not updated');
        }

        return reply.status(200).send(vulnerability);
      },
      delete: async (req, reply) => {
        const vulnerability = await fastify.prisma.vulnerability.delete({
          where: { id: req.params.id as string },
        });

        if (!vulnerability) {
          return reply.status(400).send('Vulnerability not deleted');
        }

        return reply.status(200).send(vulnerability);
      },
    },
  })
  .register(crud, {
    prefix: '/api/v1/asset',
    controller: {
      list: async (req, reply) => {
        const assets = await fastify.prisma.asset.findMany();

        if (!assets) {
          return reply.status(400).send('Assets not found');
        }

        return reply.status(200).send(assets);
      },
      create: async (req, reply) => {
        const asset = await fastify.prisma.asset.create({
          data: {
            name: req.body.name,
            type: req.body.type,
            // Configuration: { create: { name: req.body.configurationName, value: req.body.configurationValue, asset: { connect: { id: req.body.assetId } } }
          },
        });

        if (!asset) {
          return reply.status(400).send('Asset not created');
        }

        return reply.status(200).send(asset);
      },
      view: async (req, reply) => {
        const asset = await fastify.prisma.asset.findUnique({
          where: { id: req.params.id as string },
        });

        if (!asset) {
          return reply.status(400).send('Asset not found');
        }

        return reply.status(200).send(asset);
      },
      update: async (req, reply) => {
        const asset = await fastify.prisma.asset.update({
          where: { id: req.params.id as string },
          data: {
            name: req.body.name,
            type: req.body.type,
          },
        });

        if (!asset) {
          return reply.status(400).send('Asset not updated');
        }

        return reply.status(200).send(asset);
      },
      delete: async (req, reply) => {
        const asset = await fastify.prisma.asset.delete({
          where: { id: req.params.id as string },
        });

        if (!asset) {
          return reply.status(400).send('Asset not deleted');
        }

        return reply.status(200).send(asset);
      },
    },
  })
  .register(crud, {
    prefix: '/api/v1/configuration',
    controller: {
      list: async (req, reply) => {
        const configurations = await fastify.prisma.configuration.findMany();

        if (!configurations) {
          return reply.status(400).send('Configurations not found');
        }

        return reply.status(200).send(configurations);
      },
      create: async (req, reply) => {
        const configuration = await fastify.prisma.configuration.create({
          data: {
            name: req.body.name,
            value: req.body.value,
            asset: { connect: { id: req.body.assetId } },
          },
        });

        if (!configuration) {
          return reply.status(400).send('Configuration not created');
        }

        return reply.status(200).send(configuration);
      },
      view: async (req, reply) => {
        const configuration = await fastify.prisma.configuration.findUnique({
          where: { id: req.params.id as string },
        });

        if (!configuration) {
          return reply.status(400).send('Configuration not found');
        }

        return reply.status(200).send(configuration);
      },
      update: async (req, reply) => {
        const configuration = await fastify.prisma.configuration.update({
          where: { id: req.params.id as string },
          data: {
            name: req.body.name,
            value: req.body.value,
            asset: { connect: { id: req.body.assetId } },
          },
        });

        if (!configuration) {
          return reply.status(400).send('Configuration not updated');
        }

        return reply.status(200).send(configuration);
      },
      delete: async (req, reply) => {
        const configuration = await fastify.prisma.configuration.delete({
          where: { id: req.params.id as string },
        });

        if (!configuration) {
          return reply.status(400).send('Configuration not deleted');
        }

        return reply.status(200).send(configuration);
      },
    },
  });

// Init Fastify server
const PORT = parseInt(process.env.PORT) || 8080;
fastify
  // .get('/', (req, reply) => {})
  .listen(
    {
      port: PORT,
      host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
    },
    (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);

      startSwagger();

      fastify.blipp();

      // console.log(fastify.printRoutes());
      // console.log(fastify.printPlugins());
    }
  );

async function startSwagger() {
  try {
    await fastify.ready();
    fastify.swagger();
  } catch (err) {
    fastify.log.error(err);
  }
}
