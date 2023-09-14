import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

export const root: FastifyPluginCallback = fp((fastify, options, done) => {
  fastify.get('/', async (request, reply) => {
    reply.send(fastify.printRoutes());
  });

  done();
});
