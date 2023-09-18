import { PrismaClient, Token, User, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

export function ExtendUsers(prismaUser: PrismaClient['user']) {
  return Object.assign(prismaUser, {
    async findByCredentials(email, password) {
      const user = await prismaUser.findFirst({
        where: { email },
      });

      if (!user) throw new Error('No user');

      // BUG: bcrypt.compare always returns false
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) throw new Error('Bad credentials');

      return user;
    },
  });
}
