import 'module-alias/register';
import Fastify, { FastifyInstance } from 'fastify';
import { join } from 'path';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import autoLoad from '@fastify/autoload';
import { fastifyBcrypt } from 'fastify-bcrypt';
import 'dotenv/config';
import fastifySwaggerUIPlugin from './lib/spec/swagger/html';
import { getPing } from '@routes/utils/get-ping';
import { register } from '@routes/auth/register';
import { home } from '@routes/home/home';
import { login } from '@routes/auth/login';
import { root } from '@routes/root';
import { me } from '@routes/user/me';
import { registerControllers } from '@routes/register-controllers';
import { startSwagger } from '@docs/start-swagger';
import { summary } from '@routes/check/summary';
import createAlertJob from './tasks/createAlert';
import createLogJob from './tasks/createLog';
import createIncidentJob from './tasks/createIncident';
import createUserJob from './tasks/createUser';

export const fastify: FastifyInstance = Fastify({
  logger: {
    transport: {
      target: '@fastify/one-line-logger',
    },
  },
}).withTypeProvider<TypeBoxTypeProvider>();

// Plugins
fastify.register(import('fastify-markdown'), { data: true });
fastify.register(import('fastify-blipp'));
fastify.register(import('@fastify/sensible'));
fastify.register(import('@fastify/schedule'));
fastify.register(fastifyBcrypt, {
  saltWorkFactor: 12,
});
fastify.register(autoLoad, {
  dir: join(__dirname, 'plugins'),
});
fastify.register(fastifySwaggerUIPlugin);

// Plugin Routes
fastify.register(getPing);
fastify.register(me);
fastify.register(register);
fastify.register(login);
fastify.register(home);
fastify.register(root);
fastify.register(summary);

// Decorators
fastify.decorate('registerControllers', registerControllers);

// CRUD Routes
fastify.registerControllers();

fastify.ready().then(() => {
  fastify.scheduler.addSimpleIntervalJob(createAlertJob);
  fastify.scheduler.addSimpleIntervalJob(createLogJob);
  fastify.scheduler.addSimpleIntervalJob(createIncidentJob);
  fastify.scheduler.addSimpleIntervalJob(createUserJob);
});

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
