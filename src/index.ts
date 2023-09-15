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
      delete: async (req, reply) => {},
    },
  })
  .register(crud, {
    prefix: '/api/v1/log',
    controller: {
      list: async (req, reply) => {},
      create: async (req, reply) => {},
      view: async (req, reply) => {},
      update: async (req, reply) => {},
      delete: async (req, reply) => {},
    },
  })
  .register(crud, {
    prefix: '/api/v1/alert',
    controller: {
      list: async (req, reply) => {},
      create: async (req, reply) => {},
      view: async (req, reply) => {},
      update: async (req, reply) => {},
      delete: async (req, reply) => {},
    },
  })
  .register(crud, {
    prefix: '/api/v1/incident',
    controller: {
      list: async (req, reply) => {},
      create: async (req, reply) => {},
      view: async (req, reply) => {},
      update: async (req, reply) => {},
      delete: async (req, reply) => {},
    },
  })
  .register(crud, {
    prefix: '/api/v1/vulnerability',
    controller: {
      list: async (req, reply) => {},
      create: async (req, reply) => {},
      view: async (req, reply) => {},
      update: async (req, reply) => {},
      delete: async (req, reply) => {},
    },
  })
  .register(crud, {
    prefix: '/api/v1/asset',
    controller: {
      list: async (req, reply) => {},
      create: async (req, reply) => {},
      view: async (req, reply) => {},
      update: async (req, reply) => {},
      delete: async (req, reply) => {},
    },
  })
  .register(crud, {
    prefix: '/api/v1/configuration',
    controller: {
      list: async (req, reply) => {},
      create: async (req, reply) => {},
      view: async (req, reply) => {},
      update: async (req, reply) => {},
      delete: async (req, reply) => {},
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
