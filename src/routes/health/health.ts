import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

export const health: FastifyPluginCallback = fp((fastify, options, done) => {
  fastify.route({
    method: 'GET',
    url: '/api/v1/health',
    handler: function (request, reply) {
      reply.send({ ping: 'Server up' });
    },
  });

  done();
});
