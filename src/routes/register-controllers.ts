import fp from 'fastify-plugin';
import FastifyAuth from '@fastify/auth';
import crud from 'fastify-crud-generator';
import { fastify } from '@root/index';
import { userControllers } from '@routes/user/controllers';
import { logControllers } from '@routes/log/controllers';
import { alertControllers } from '@routes/alert/controllers';
import { incidentControllers } from '@routes/incident/controllers';
import { vulnerabilityControllers } from '@routes/vulnerability/controllers';
import { assetControllers } from '@routes/asset/controllers';
import { configurationControllers } from '@routes/configuration/controllers';
import { asyncVerifyJWT } from '@utils/asyncVerifyJWT';

function getPrehandlers(fastify) {
  const preHandler = fastify.auth([fastify.asyncVerifyJWT]);
  return {
    list: {
      preHandler,
    },
    create: {
      preHandler,
    },
    view: {
      preHandler,
    },
    update: {
      preHandler,
    },
    delete: {
      preHandler,
    },
  };
}

export const registerControllers = fp((fastify, opts, done) => {
  fastify
    .decorate('asyncVerifyJWT', asyncVerifyJWT)
    .register(FastifyAuth)
    .after(() => {
      fastify
        .register(crud, {
          prefix: '/api/v1/user',
          controller: userControllers,
          ...getPrehandlers(fastify),
        })
        .register(crud, {
          prefix: '/api/v1/log',
          controller: logControllers,
          ...getPrehandlers(fastify),
        })
        .register(crud, {
          prefix: '/api/v1/alert',
          controller: alertControllers,
          ...getPrehandlers(fastify),
        })
        .register(crud, {
          prefix: '/api/v1/incident',
          controller: incidentControllers,
          ...getPrehandlers(fastify),
        })
        .register(crud, {
          prefix: '/api/v1/vulnerability',
          controller: vulnerabilityControllers,
          ...getPrehandlers(fastify),
        })
        .register(crud, {
          prefix: '/api/v1/asset',
          controller: assetControllers,
          ...getPrehandlers(fastify),
        })
        .register(crud, {
          prefix: '/api/v1/configuration',
          controller: configurationControllers,
          ...getPrehandlers(fastify),
        });
    });

  done();
});
