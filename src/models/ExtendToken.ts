import { PrismaClient, Token, User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { fastify } from '@root/index';

export function ExtendToken(prismaToken: PrismaClient['token']) {
  return Object.assign(prismaToken, {
    async generateToken(user) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '72hr',
      });

      const created = await prismaToken.create({
        data: {
          token: token,
          user: { connect: { id: user.id } },
        },
      });

      return created;
    },

    // TODO: handle use case of expired token
    async findUserByToken(token) {
      let decoded;

      try {
        if (!token) return new Error('Missing token header');
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        fastify.log.error(err);
        return err;
      }

      try {
        const user = await fastify.prisma.user.findUnique({
          where: { id: decoded.id },
          include: { tokens: true },
        });
        if (!user.tokens.length) return new Error('You have been logged out');
        if (!user) return new Error('User not found');

        return user;
      } catch (error) {
        fastify.log.error(error);
        return error;
      }
    },
  });
}
