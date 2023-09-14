import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import { UserType, User } from "../../typebox/User";
import { getAuth, clerkClient } from "@clerk/fastify";

export const createUser: FastifyPluginCallback = fp(
  (fastify, options, done) => {
    fastify.setErrorHandler((error, request, reply) => {});

    fastify.post<{ Body: UserType; Reply: UserType | unknown }>(
      "/user/create",
      {
        onError: (error, request, reply) => {
          fastify.log.error(error);
        },
        preHandler: async (request, reply, done) => {},
        preValidation: async (request, reply, done) => {},
      },
      async (request, reply) => {}
    );

    done();
  }
);
