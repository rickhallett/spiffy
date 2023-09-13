import { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";
import { UserType, User } from "../../typebox/User";

export const createUser: FastifyPluginCallback = fp(
  (fastify, options, done) => {
    fastify.setErrorHandler((error, request, reply) => {});

    fastify.post<{ Body: UserType; Reply: UserType | unknown }>(
      "/user",
      {
        schema: {
          body: User,
          response: {
            200: User,
          },
        },
        onError: (error, request, reply) => {
          fastify.log.error(error);
        },
        preValidation: async (request, reply, done) => {
          if (
            !request.body.name ||
            !request.body.email ||
            !request.body.password
          ) {
            reply.status(400).send({
              error:
                "Invalid request body; you must provide username, email and password",
            });
          }

          const user = await fastify.prisma.user.findUnique({
            where: { email: request.body.email },
          });
          if (user) {
            reply.status(400).send({ error: "User already exists" });
          }
        },
      },
      async (request, reply) => {
        const { name, email, password } = request.body;

        const newUser = await fastify.prisma.user.create({
          select: { id: true, name: true, email: true, password: true },
          data: {
            name,
            email,
            password,
          },
        });

        if (!newUser.id) {
          reply
            .status(500)
            .send({ error: "Failed to create user: Unknown Server Error" });
        }

        reply.status(200).send({ name, email, password: "*******" });
      }
    );

    done();
  }
);
