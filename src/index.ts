import Fastify, { FastifyInstance } from "fastify";
import { getPing } from "./routes/utils/getPing";
import { createUser } from "./routes/auth/createUser";
import { queryParamLogin } from "./routes/auth/queryParamLogin";
import { createTodo } from "./routes/todo/createTodo";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import autoLoad from "@fastify/autoload";
import { join } from "path";
import prismaPlugin from "./plugins/prisma";
import { fastifySwaggerPlugin } from "./plugins/swagger";
import { fastifySwaggerUIPlugin } from "./lib/spec/swagger/html";

const fastify: FastifyInstance = Fastify(
  {}
).withTypeProvider<TypeBoxTypeProvider>();

fastify.register(autoLoad, {
  dir: join(__dirname, "plugins"),
});

fastify.register(import("@fastify/routes"));
fastify.register(fastifySwaggerUIPlugin);

fastify.register(getPing);
fastify.register(createUser);
fastify.register(queryParamLogin);
fastify.register(createTodo);

fastify.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);

  startSwagger();

  console.log(fastify.printRoutes());
  console.log(fastify.printPlugins());
  // console.log(fastify.routes);
});

async function startSwagger() {
  try {
    await fastify.ready();
    fastify.swagger();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
