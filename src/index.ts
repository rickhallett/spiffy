import { FromSchema } from "json-schema-to-ts";
import fastify, { FastifyPluginCallback, FastifyPluginAsync } from "fastify";
import { UserType, User } from "./typebox/User";
import { todo } from "./schemas/todo";
import fp from "fastify-plugin";

// using declaration merging, add your plugin props to the appropriate fastify interfaces
// if prop type is defined here, the value will be typechecked when you call decorate{,Request,Reply}

declare module "fastify" {
  interface FastifyRequest {
    myPluginProp: string;
  }
  interface FastifyReply {
    myPluginProp: number;
  }
}

// define options
export interface MyPluginOptions {
  myPluginOption: string;
}

// define plugin using callbacks
const myPluginCallback: FastifyPluginCallback<MyPluginOptions> = (
  fastify,
  options,
  done
) => {
  fastify.decorateRequest("myPluginProp", "super_secret_value");
  fastify.decorateReply("myPluginProp", options.myPluginOption as any);

  done();
};

// define plugin using promises
const myPluginAsync: FastifyPluginAsync<MyPluginOptions> = async (
  fastify,
  options
) => {
  fastify.decorateRequest("myPluginProp", "super_secret_value");
  fastify.decorateReply("myPluginProp", options.myPluginOption as any);
};

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

const server = fastify();

server.get("/ping", async (request, reply) => {
  return reply.send({ ping: "server running!" });
});

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
});

// export plugin using fastify-plugin
export default fp(myPluginAsync, "3.x");
