import 'module-alias/register';
import Fastify, { FastifyInstance } from 'fastify';
import { join } from 'path';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import autoLoad from '@fastify/autoload';
import 'dotenv/config';
import fastifySwaggerUIPlugin from './lib/spec/swagger/html';
import { home } from '@routes/home/home';
import { root } from '@routes/root';
import { registerControllers } from '@routes/register-controllers';
import { startSwagger } from '@docs/start-swagger';
import { summary } from '@routes/check/summary';
import usersRoutes from '@routes/auth/auth-routes';
import { health } from '@routes/health/health';
import authRoutes from '@routes/auth/auth-routes';

export const saltRounds = 12;

export const fastify: FastifyInstance = Fastify({
  logger: {
    transport: {
      target: '@fastify/one-line-logger',
    },
  },
});

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
fastify.register(health);
fastify.register(home);
fastify.register(root);
fastify.register(summary);

fastify.register(authRoutes);
fastify.register(registerControllers);

// fastify.ready().then(() => {
//   fastify.scheduler.addSimpleIntervalJob(createAlertJob);
//   fastify.scheduler.addSimpleIntervalJob(createLogJob);
//   fastify.scheduler.addSimpleIntervalJob(createIncidentJob);
//   fastify.scheduler.addSimpleIntervalJob(createUserJob);
// });

fastify.addHook('onError', async (request, reply, error) => {
  fastify.log.error(error.stack);
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
