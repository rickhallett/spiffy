import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { UserType, User } from '../../typebox/User';
import { getAuth, clerkClient } from '@clerk/fastify';

export const createUser: FastifyPluginCallback = fp(
  (fastify, options, done) => {
    fastify.post(
      '/user/create',
      {
        onError: (error, request, reply) => {
          fastify.log.error(error);
        },
        preHandler: async (request, reply, done) => {},
        preValidation: async (request, reply, done) => {},
      },
      async (request, reply) => {
        const user = await fastify.prisma.user.create({
          data: {
            name: 'Rich',
            email: 'hello@prisma.com',
            posts: {
              create: {
                title: 'My first post',
                body: 'Lots of really interesting stuff',
                slug: 'my-first-post',
              },
            },
          },
        });

        if (!user) {
          reply.status(404).send({ error: 'User not created' });
        }

        reply.status(200).send({ user });
      }
    );

    done();
  }
);
