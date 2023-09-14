import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

interface IAuthQuerystring {
  username: string;
  password: string;
}

interface ICustomHeaders {
  'h-Custom': string;
}

interface IReply {
  200: { success: boolean };
  302: { url: string };
  '4xx': { error: string };
}

export const queryParamLogin: FastifyPluginCallback = fp(
  (fastify, options, done) => {
    fastify.get<{
      Querystring: IAuthQuerystring;
      Headers: ICustomHeaders;
      Reply: IReply;
    }>(
      '/auth',
      {
        preValidation: (request, reply, done) => {
          const { username, password } = request.query;
          done(username !== 'admin' ? new Error('Must be admin') : undefined);
        },
      },
      async (request, reply) => {
        const customerHeader = request.headers['h-Custom'];
        // do something with request data

        // chaining .statusCode/.code calls with .send allows type narrowing. For example:
        // this works
        reply.code(200).send({ success: true });
        // it even works for wildcards
        reply.code(404).send({ error: 'Not found' });
      }
    );

    done();
  }
);
