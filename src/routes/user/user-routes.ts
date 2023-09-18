import { FastifyInstance, FastifyRequest } from 'fastify';
import FastifyAuth from '@fastify/auth';
import { ExtendToken } from '@models/ExtendToken';
import { ExtendUsers } from '@models/ExtendUsers';
import bcrypt from 'bcrypt';
import { saltRounds } from '@root/index';

interface UserAuthRequest extends FastifyRequest {
  body: {
    username: string;
    email: string;
    password: string;
    role: string;
  };
}

const usersRoutes = async (fastify: FastifyInstance, options) => {
  const extendedToken = ExtendToken(fastify.prisma.token);

  fastify
    .decorate('asyncVerifyJWT', async (request, reply) => {
      try {
        if (!request.headers.authorization) {
          throw new Error('No token was sent');
        }
        const token = request.headers.authorization.replace('Bearer ', '');

        const user = await extendedToken.findUserByToken(token);
        if (!Boolean(user)) {
          // handles logged out user with valid token
          throw new Error('Authentication failed!');
        }
        request.user = user;
        request.token = token; // used in logout route
      } catch (error) {
        reply.code(401).send(error);
      }
    })
    .decorate(
      'asyncVerifyUsernameAndPassword',
      async (request: UserAuthRequest, reply) => {
        try {
          if (!request.body) {
            throw new Error('Username and password is required!');
          }
          const { email, password } = request.body;
          const extendedUsers = ExtendUsers(fastify.prisma.user);
          const user = await extendedUsers.findByCredentials(email, password);
          request.user = user;
        } catch (error) {
          reply.code(400).send(error);
        }
      }
    )
    .register(FastifyAuth)
    .after(() => {
      fastify.route({
        method: ['POST', 'HEAD'],
        url: '/api/v1/register',
        logLevel: 'warn',
        handler: async (req: UserAuthRequest, reply) => {
          const userExists = await fastify.prisma.user.findFirst({
            where: { email: req.body.email },
          });

          if (userExists) {
            return reply.code(400).send('User already exists');
          }

          const user = await fastify.prisma.user.create({
            data: {
              email: req.body.email,
              password: await bcrypt.hash(req.body.password, saltRounds),
            },
          });

          reply.code(200).send({ user: user.email });
        },
      });

      fastify.route({
        method: ['POST', 'HEAD'],
        url: '/api/v1/login',
        logLevel: 'warn',
        preHandler: fastify.auth([fastify.asyncVerifyUsernameAndPassword]),
        handler: async (req, reply) => {
          const newToken = await extendedToken.generateToken(req.user);
          reply.send({
            status: 'You are logged in',
            user: req.user,
            token: newToken.token,
          });
        },
      });

      fastify.route({
        method: ['GET', 'HEAD'],
        url: '/api/v1/profile',
        logLevel: 'warn',
        preHandler: fastify.auth([fastify.asyncVerifyJWT]),
        handler: async (req, reply) => {
          fastify.log.info(req);
          reply.send({ status: 'You are logged in', user: req });
        },
      });

      fastify.route({
        method: ['POST', 'HEAD'],
        url: '/api/v1/logout',
        logLevel: 'warn',
        preHandler: fastify.auth([fastify.asyncVerifyJWT]),
        handler: async (req, reply) => {
          await fastify.prisma.token.delete({
            where: { id: req.token },
          });
          reply.send({ status: 'You are logged out' });
        },
      });
    });
};

export default usersRoutes;
