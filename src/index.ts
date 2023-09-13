import { FromSchema } from "json-schema-to-ts";
import Fastify, { FastifyInstance } from "fastify";
import { UserType, User } from "./typebox/User";
import { todo } from "./schemas/todo";
import { pingRoute } from "./routes/utils/ping";

interface IAuthQuerystring {
  username: string;
  password: string;
}

interface ICustomHeaders {
  "h-Custom": string;
}

interface IReply {
  200: { success: boolean };
  302: { url: string };
  "4xx": { error: string };
}

const server: FastifyInstance = Fastify({});

server.register(pingRoute);

server.get<{
  Querystring: IAuthQuerystring;
  Headers: ICustomHeaders;
  Reply: IReply;
}>(
  "/auth",
  {
    preValidation: (request, reply, done) => {
      const { username, password } = request.query;
      done(username !== "admin" ? new Error("Must be admin") : undefined);
    },
  },
  async (request, reply) => {
    const customerHeader = request.headers["h-Custom"];
    // do something with request data

    // chaining .statusCode/.code calls with .send allows type narrowing. For example:
    // this works
    reply.code(200).send({ success: true });
    // it even works for wildcards
    reply.code(404).send({ error: "Not found" });
  }
);

server.post<{ Body: UserType; Reply: UserType }>(
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

server.post<{ Body: FromSchema<typeof todo> }>(
  "/todo",
  {
    schema: {
      body: todo,
      response: {
        201: {
          type: "string",
        },
      },
    },
  },
  async (request, reply): Promise<void> => {
    reply.status(201).send(
      JSON.stringify({
        requestBody: request.body,
        replyBody: request.body,
      })
    );
  }
);

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
  console.log(server.printRoutes({ includeHooks: true }));
  console.log(server.printPlugins());
});
