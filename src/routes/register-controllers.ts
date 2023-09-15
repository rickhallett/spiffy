import crud from 'fastify-crud-generator';
import { fastify } from '@root/index';
import { userControllers } from '@routes/user/controllers';
import { logControllers } from '@routes/log/controllers';
import { alertControllers } from '@routes/alert/controllers';
import { incidentControllers } from '@routes/incident/controllers';
import { vulnerabilityControllers } from '@routes/vulnerability/controllers';
import { assetControllers } from '@routes/asset/controllers';
import { configurationControllers } from '@routes/configuration/controllers';

export function registerControllers() {
  fastify
    .register(crud, {
      prefix: '/api/v1/user',
      controller: userControllers,
    })
    .register(crud, {
      prefix: '/api/v1/log',
      controller: logControllers,
    })
    .register(crud, {
      prefix: '/api/v1/alert',
      controller: alertControllers,
    })
    .register(crud, {
      prefix: '/api/v1/incident',
      controller: incidentControllers,
    })
    .register(crud, {
      prefix: '/api/v1/vulnerability',
      controller: vulnerabilityControllers,
    })
    .register(crud, {
      prefix: '/api/v1/asset',
      controller: assetControllers,
    })
    .register(crud, {
      prefix: '/api/v1/configuration',
      controller: configurationControllers,
    });
}
