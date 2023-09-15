import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

export const register: FastifyPluginCallback = fp((fastify, options, done) => {
  fastify.get('/auth/register', async (request, reply) => {
    reply.redirect(`https://fresh-tetra-83.accounts.dev/sign-up`);
  });

  done();
});
