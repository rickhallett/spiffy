import { FastifyInstance, FastifyRequest } from 'fastify';
import FastifyAuth from '@fastify/auth';
import { ExtendToken } from '@models/ExtendToken';
import { ExtendUsers } from '@models/ExtendUsers';
import bcrypt from 'bcrypt';
import { saltRounds } from '@root/index';
import { asyncVerifyJWT } from '@root/utils/asyncVerifyJWT';

interface UserAuthRequest extends FastifyRequest {
  body: {
    username: string;
    email: string;
    password: string;
    role: string;
  };
}

const authRoutes = async (fastify: FastifyInstance, options) => {
  const extendedToken = ExtendToken(fastify.prisma.token);

  fastify
    .decorate('asyncVerifyJWT', asyncVerifyJWT)
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
          if (req.user.name === 'JsonWebTokenError') {
            return reply.status(401).send(req.user);
          }
          reply.send({ status: 'You are logged in', user: req.user });
        },
      });

      fastify.route({
        method: ['POST', 'HEAD'],
        url: '/api/v1/logout',
        logLevel: 'warn',
        preHandler: fastify.auth([fastify.asyncVerifyJWT]),
        handler: async (req, reply) => {
          try {
            const token = await fastify.prisma.token.findFirst({
              where: { token: req.token },
            });

            if (!token) {
              return reply.status(401).send('Token not found');
            }

            await fastify.prisma.token.delete({
              where: { id: token.id },
            });
          } catch (error) {
            reply.status(500).send(error);
          }
          reply.send({ status: 'You are logged out' });
        },
      });
    });
};

export default authRoutes;
