import { fastify } from '@root/index';

export async function startSwagger() {
  try {
    await fastify.ready();
    fastify.swagger();
  } catch (err) {
    fastify.log.error(err);
  }
}
