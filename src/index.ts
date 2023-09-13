import Fastify, { FastifyInstance } from "fastify";
import { getPing } from "./routes/utils/getPing";
import { createUser } from "./routes/auth/createUser";
import { queryParamLogin } from "./routes/auth/queryParamLogin";
import { createTodo } from "./routes/todo/createTodo";
import prismaPlugin from "./plugins/prisma";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

const server: FastifyInstance = Fastify(
  {}
).withTypeProvider<TypeBoxTypeProvider>();

server.register(prismaPlugin);
server.register(getPing);
server.register(createUser);
server.register(queryParamLogin);
server.register(createTodo);

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
  console.log(server.printRoutes({ includeHooks: true }));
  console.log(server.printPlugins());
});
