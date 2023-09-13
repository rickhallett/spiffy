import Fastify, { FastifyInstance } from "fastify";
import { getPing } from "./routes/utils/getPing";
import { createUser } from "./routes/auth/createUser";
import { queryParamLogin } from "./routes/auth/queryParamLogin";
import { createTodo } from "./routes/todo/createTodo";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import autoLoad from "@fastify/autoload";
import { join } from "path";

const fastify: FastifyInstance = Fastify(
  {}
).withTypeProvider<TypeBoxTypeProvider>();

fastify.register(autoLoad, {
  dir: join(__dirname, "plugins"),
});

fastify.register(import("@fastify/routes"));

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
  console.log(fastify.printRoutes({ includeHooks: true }));
  console.log(fastify.printPlugins());
  // console.log(fastify.routes);
});
