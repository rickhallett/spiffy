import { ExtendToken } from '@models/ExtendToken';
import { fastify } from '@root/index';

export const asyncVerifyJWT = async (request, reply) => {
  const extendedToken = ExtendToken(fastify.prisma.token);
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
};
