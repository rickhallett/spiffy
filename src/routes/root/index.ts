import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { writeFile } from 'fs';

export const root: FastifyPluginCallback = fp((fastify, options, done) => {
  fastify.get('/', async (request, reply) => {
    writeFile(
      './routes.txt',
      fastify.printRoutes(),
      { encoding: 'utf8', flag: 'w' },
      (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      }
    );

    reply.send(fastify.printRoutes());
  });

  done();
});
