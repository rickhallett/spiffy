import { ExtendToken } from '@models/ExtendToken';
import { fastify } from '@root/index';

export const asyncVerifyJWT = async (request, reply) => {
  const extendedToken = ExtendToken(fastify.prisma.token);
  try {
    if (!request.headers.authorization) {
      throw new Error('No token was sent');
    }
    const token = request.headers.authorization.replace('Bearer ', '');

    const lookup = await extendedToken.findUserByToken(token);

    if (lookup instanceof Error) {
      throw new Error(lookup.message);
    }

    request.user = lookup;
    request.token = token; // used in logout route
  } catch (error) {
    reply.code(401).send(error);
  }
};
