import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { UserType, User } from '../../typebox/User';
import { getAuth, clerkClient } from '@clerk/fastify';

export const signout: FastifyPluginCallback = fp((fastify, options, done) => {
  fastify.get('/auth/signout', async (request, reply) => {
    reply.redirect('https://fresh-tetra-83.accounts.dev/user');
    const user = await clerkClient.users.getUser(
      getAuth(request).userId as string
    );
    // await clerkClient.sessions.revokeSession(user.sessions[0].id)
    // clerkClient.sessions.getSession(user.sessions[0].id)
  });

  done();
});
