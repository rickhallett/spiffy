import FastifyAuth from '@fastify/auth';
import 'module-alias/register';
import Fastify, { FastifyInstance } from 'fastify';
import { join } from 'path';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import autoLoad from '@fastify/autoload';
import 'dotenv/config';
import fastifySwaggerUIPlugin from './lib/spec/swagger/html';
import { getPing } from '@routes/utils/get-ping';
import { home } from '@routes/home/home';
import { root } from '@routes/root';
import { registerControllers } from '@routes/register-controllers';
import { startSwagger } from '@docs/start-swagger';
import { summary } from '@routes/check/summary';
import usersRoutes from '@routes/user/user-routes';
// import {
//   asyncVerifyJWT,
//   asyncVerifyUsernameAndPassword,
// } from '@routes/user/user-routes';

export const saltRounds = 12;

export const fastify: FastifyInstance = Fastify({
  logger: {
    transport: {
      target: '@fastify/one-line-logger',
    },
  },
}).withTypeProvider<TypeBoxTypeProvider>();

// Plugins
// fastify.register(FastifyAuth);
fastify.register(import('fastify-markdown'), { data: true });
fastify.register(import('fastify-blipp'));
fastify.register(import('@fastify/sensible'));
fastify.register(import('@fastify/schedule'));
fastify.register(autoLoad, {
  dir: join(__dirname, 'plugins'),
});
fastify.register(fastifySwaggerUIPlugin);

// Plugin Routes
fastify.register(getPing);
fastify.register(home);
fastify.register(root);
fastify.register(summary);

fastify.register(registerControllers);
fastify.register(usersRoutes);

// Decorators
// fastify.decorate('registerControllers', registerControllers);

// CRUD Routes
// fastify.registerControllers();

// fastify.ready().then(() => {
//   fastify.scheduler.addSimpleIntervalJob(createAlertJob);
//   fastify.scheduler.addSimpleIntervalJob(createLogJob);
//   fastify.scheduler.addSimpleIntervalJob(createIncidentJob);
//   fastify.scheduler.addSimpleIntervalJob(createUserJob);
// });

fastify.addHook('onError', async (request, reply, error) => {
  fastify.log.error(error);
});

// fastify.addHook('onRequest', (request, reply, done) => {
//   const alreadyAuthenticated = [
//     '/api/v1/login',
//     '/api/v1/register',
//     '/api/v1/profile',
//     '/api/v1/logout',
//   ];
//   if (alreadyAuthenticated.includes(request.url)) {
//     return;
//   }

//   try {
//     fastify.auth([fastify.asyncVerifyJWT]);
//   } catch (err) {
//     fastify.log.error(err);
//     reply.status(401).send({ status: 'Unauthorized' });
//   }
// });

// Init Fastify server
fastify.listen(
  {
    port: parseInt(process.env.PORT) || 8080,
    host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
  },
  async (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);

    startSwagger();

    fastify.blipp();
  }
);
