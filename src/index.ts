import Fastify, { FastifyInstance } from 'fastify';
import { getPing } from './routes/utils/getPing';
import { createUser } from './routes/user/createUser';
import { queryParamLogin } from './routes/auth/queryParamLogin';
import { createTodo } from './routes/todo/createTodo';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import autoLoad from '@fastify/autoload';
import { join } from 'path';
import { fastifySwaggerUIPlugin } from './lib/spec/swagger/html';
import 'dotenv/config';
import { register } from './routes/auth/register';
import { getUsers } from './routes/user/getUsers';
import { home } from './routes/home/home';
// import { signOut } from "./routes/auth/signout";
import { login } from './routes/auth/login';
import { root } from './routes/root';
import { me } from './routes/user/me';

const fastify: FastifyInstance = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

// Plugins
fastify.register(autoLoad, {
  dir: join(__dirname, 'plugins'),
});

fastify.register(fastifySwaggerUIPlugin);

// Routes
fastify.register(getPing);
fastify.register(createUser);
fastify.register(getUsers);
fastify.register(me);

fastify.register(queryParamLogin);
fastify.register(createTodo);
fastify.register(register);
fastify.register(login);
// fastify.register(signOut);
fastify.register(home);
fastify.register(root);

// Init Fastify server
fastify.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);

  startSwagger();

  console.log(fastify.printRoutes());
  // console.log(fastify.printPlugins());
  // console.log(fastify.routes);
});

async function startSwagger() {
  try {
    await fastify.ready();
    fastify.swagger();
  } catch (err) {
    fastify.log.error(err);
  }
}
