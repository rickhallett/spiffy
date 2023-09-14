import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import { getAuth, clerkClient } from "@clerk/fastify";
import { clerkPlugin } from "@clerk/fastify";

export const getUsers: FastifyPluginCallback = fp((fastify, options, done) => {
  fastify.register(clerkPlugin);
  fastify.get(
    "/user/all",
    {
      onError: (error, request, reply) => {
        fastify.log.error(error);
      },
      errorHandler: (error, request, reply) => {
        reply.send(JSON.stringify(error));
      },
      preHandler: async (request, reply, done) => {
        const { userId } = getAuth(request);
        if (!userId) {
          return reply
            .code(403)
            .send("You must be logged in to view all users");
        }

        const user = userId ? await clerkClient.users.getUser(userId) : null;
        done();
      },
    },
    async (request, reply) => {
      const users = await clerkClient.users.getUserList();

      if (users.length === 0) {
        reply.status(404).send({ error: "No users available" });
      }

      reply.status(200).send({ users });
    }
  );

  done();
});
