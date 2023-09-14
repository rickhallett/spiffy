import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

export const login: FastifyPluginCallback = fp((fastify, options, done) => {
  fastify.get('/auth/login', async (request, reply) => {
    reply.redirect('https://fresh-tetra-83.accounts.dev/sign-in');
  });

  done();
});
