import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

export const summary: FastifyPluginCallback = fp((fastify, options, done) => {
  fastify.get('/api/v1/summary', async (request, reply) => {
    const counts = {
      users: await fastify.prisma.user.count(),
      logs: await fastify.prisma.log.count(),
      roles: await fastify.prisma.role.count(),
      alerts: await fastify.prisma.alert.count(),
      incidents: await fastify.prisma.incident.count(),
      vulnerabilities: await fastify.prisma.vulnerability.count(),
      assets: await fastify.prisma.asset.count(),
      configurations: await fastify.prisma.configuration.count(),
    };

    return reply.status(200).send(counts);
  });

  done();
});
