import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";

export const pingRoute: FastifyPluginCallback = fp((fastify, options, done) => {
  fastify.route({
    method: "GET",
    url: "/ping",
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            ping: { type: "string" },
          },
        },
      },
    },
    handler: function (request, reply) {
      reply.send({ ping: "Server running!" });
    },
  });

  done();
});
