import { fastify } from '@root/index';

export async function list(req, reply) {
  const logs = await fastify.prisma.log.findMany();

  if (!logs) {
    return reply.status(400).send('Logs not found');
  }

  return reply.status(200).send(logs);
}

export async function create(req, reply) {
  const log = await fastify.prisma.log.create({
    data: {
      message: req.body.message,
      level: req.body.level,
      user: { connect: { id: req.body.userId } },
    },
  });

  if (!log) {
    return reply.status(400).send('Log not created');
  }

  return reply.status(200).send(log);
}

export async function view(req, reply) {
  const log = await fastify.prisma.log.findUnique({
    where: { id: req.params.id as string },
  });

  if (!log) {
    return reply.status(400).send('Log not found');
  }

  return reply.status(200).send(log);
}

export async function update(req, reply) {
  const log = await fastify.prisma.log.update({
    where: { id: req.params.id as string },
    data: {
      message: req.body.message,
      level: req.body.level,
      user: { connect: { id: req.body.userId } },
    },
  });

  if (!log) {
    return reply.status(400).send('Log not updated');
  }

  return reply.status(200).send(log);
}

export async function deleteOne(req, reply) {
  const log = await fastify.prisma.log.delete({
    where: { id: req.params.id as string },
  });

  if (!log) {
    return reply.status(400).send('Log not deleted');
  }

  return reply.status(200).send(log);
}

export const logControllers = {
  list,
  create,
  view,
  update,
  deleteOne,
};
