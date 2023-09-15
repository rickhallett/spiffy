import { fastify } from '@root/index';

export async function list(req, reply) {
  const alerts = await fastify.prisma.alert.findMany();

  if (!alerts) {
    return reply.status(400).send('Alerts not found');
  }

  return reply.status(200).send(alerts);
}

export async function create(req, reply) {
  const alert = await fastify.prisma.alert.create({
    data: {
      message: req.body.message,
      level: req.body.level,
      user: { connect: { id: req.body.userId } },
    },
  });

  if (!alert) {
    return reply.status(400).send('Alert not created');
  }

  return reply.status(200).send(alert);
}

export async function view(req, reply) {
  const alert = await fastify.prisma.alert.findUnique({
    where: { id: req.params.id as string },
  });

  if (!alert) {
    return reply.status(400).send('Alert not found');
  }

  return reply.status(200).send(alert);
}

export async function update(req, reply) {
  const alert = await fastify.prisma.alert.update({
    where: { id: req.params.id as string },
    data: {
      message: req.body.message,
      level: req.body.level,
      user: { connect: { id: req.body.userId } },
    },
  });

  if (!alert) {
    return reply.status(400).send('Alert not updated');
  }

  return reply.status(200).send(alert);
}

export async function deleteOne(req, reply) {
  const alert = await fastify.prisma.alert.delete({
    where: { id: req.params.id as string },
  });

  if (!alert) {
    return reply.status(400).send('Alert not deleted');
  }

  return reply.status(200).send(alert);
}

export const alertControllers = {
  list,
  create,
  view,
  update,
  deleteOne,
};
