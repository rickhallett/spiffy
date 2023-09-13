import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import { UserType, User } from "../../typebox/User";

export const createUser: FastifyPluginCallback = fp(
  (fastify, options, done) => {
    fastify.post<{ Body: UserType; Reply: UserType }>(
      "/",
      {
        schema: {
          body: User,
          response: {
            200: User,
          },
        },
      },
      (request, reply) => {
        // The `name` and `mail` types are automatically inferred
        const { name, mail }: { name: string; mail?: string | undefined } =
          request.body;
        reply.status(200).send({ name, mail: mail ?? "no mail" });
      }
    );

    done();
  }
);
