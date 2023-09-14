import fp from 'fastify-plugin';
import {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifyError,
} from 'fastify';
import { FromSchema } from 'json-schema-to-ts';
import { todo } from '../../schemas/todo';

export const createTodo: FastifyPluginCallback = fp(
  (
    fastify: FastifyInstance,
    options: FastifyPluginOptions,
    done: (error?: FastifyError) => void
  ) => {
    fastify.post<{ Body: FromSchema<typeof todo> }>(
      '/todo',
      {
        schema: {
          body: todo,
          response: {
            201: {
              type: 'string',
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

    done();
  }
);
