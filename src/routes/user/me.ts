import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { getAuth, clerkClient } from '@clerk/fastify';
import { clerkPlugin } from '@clerk/fastify';

export const me: FastifyPluginCallback = fp((fastify, options, done) => {
  fastify.get(
    '/api/v1/user/me',
    {
      onError: (error, request, reply) => {
        fastify.log.error(error);
      },
      errorHandler: (error, request, reply) => {
        reply.send(JSON.stringify(error));
      },
      preHandler: async (request, reply, done) => {
        const { userId } = getAuth(request);
        if (!userId) {
          return reply
            .code(403)
            .send('You must be logged in to view your user profile');
        }

        done();
      },
    },
    async (request, reply) => {
      const { userId } = getAuth(request);
      const user = await clerkClient.users.getUser(userId as string);

      reply.status(200).send({ user });
    }
  );

  done();
});
