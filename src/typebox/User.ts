import { Static, Type } from '@sinclair/typebox';

export const User = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 6 }),
});

export type UserType = Static<typeof User>;
