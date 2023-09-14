import { clerkClient, getAuth } from "@clerk/fastify";
import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";

export const home: FastifyPluginCallback = fp((fastify, options, done) => {
  fastify.get(
    "/home",
    {
      onResponse: (request, reply) => {
        const milliseconds = reply.getResponseTime();
      },
    },
    async (request, reply) => {
      const { userId } = getAuth(request);
      if (!userId) {
        reply.send({ status: "User not authenticated" });
      }

      const user = await clerkClient.users.getUser(userId as string);
      reply.send({
        status: "User authenticated",
        user,
      });
    }
  );

  done();
});
