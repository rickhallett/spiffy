import fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { UserType, User } from "./typebox/User";
import { todo } from "./schemas/todo";

interface IQuerystring {
  username: string;
  password: string;
}

interface IHeaders {
  "h-Custom": string;
}

interface IReply {
  200: { success: boolean };
  302: { url: string };
  "4xx": { error: string };
}

// import json schemas as normal
import QuerystringSchema from './schemas/querystring.json'
import HeadersSchema from './schemas/headers.json'

// import the generated interfaces
import { QuerystringSchema as QuerystringSchemaInterface } from './types/querystring'
import { HeadersSchema as HeadersSchemaInterface } from './types/headers'

const server = fastify().withTypeProvider<TypeBoxTypeProvider>();

server.get("/ping", async (request, reply) => {
  return reply.send({ ping: "server running!" });
});

server.get<{
  Querystring: QuerystringSchemaInterface;
  Headers: HeadersSchemaInterface;
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

server.route<{
  Querystring: QuerystringSchemaInterface,
  Headers: HeadersSchemaInterface
}>({
  method: 'GET',
  url: '/auth2',
  schema: {
    querystring: QuerystringSchema,
    headers: HeadersSchema
  },
  preHandler: (request, reply, done) => {
    const { username, password } = request.query
    const customerHeader = request.headers['h-Custom']
    done()
  },
  handler: (request, reply) => {
    const { username, password } = request.query
    const customerHeader = request.headers['h-Custom']
    reply.status(200).send({username});
  }
});

import { FromSchema } from "json-schema-to-ts";

server.post<{ Body: FromSchema<typeof todo> }>(
  '/todo',
  {
    schema: {
      body: todo,
      response: {
        201: {
          type: 'string',
        },
      },
    }
  },
  async (request, reply): Promise<void> => {

    /*
    request.body has type
    {
      [x: string]: unknown;
      description?: string;
      done?: boolean;
      name: string;
    }
    */

    request.body.name // will not throw type error
    request.body.notthere // will throw type error

    reply.status(201).send(JSON.stringify({requestBody: request.body}));
  },
);

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
