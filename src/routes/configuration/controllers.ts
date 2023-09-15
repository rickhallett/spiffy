import { fastify } from '@root/index';

export async function list(req, reply) {
  const configurations = await fastify.prisma.configuration.findMany();

  if (!configurations) {
    return reply.status(400).send('Configurations not found');
  }

  return reply.status(200).send(configurations);
}

export async function create(req, reply) {
  const configuration = await fastify.prisma.configuration.create({
    data: {
      name: req.body.name,
      value: req.body.value,
      asset: { connect: { id: req.body.assetId } },
    },
  });

  if (!configuration) {
    return reply.status(400).send('Configuration not created');
  }

  return reply.status(200).send(configuration);
}

export async function view(req, reply) {
  const configuration = await fastify.prisma.configuration.findUnique({
    where: { id: req.params.id as string },
  });

  if (!configuration) {
    return reply.status(400).send('Configuration not found');
  }

  return reply.status(200).send(configuration);
}

export async function update(req, reply) {
  const configuration = await fastify.prisma.configuration.update({
    where: { id: req.params.id as string },
    data: {
      name: req.body.name,
      value: req.body.value,
      asset: { connect: { id: req.body.assetId } },
    },
  });

  if (!configuration) {
    return reply.status(400).send('Configuration not updated');
  }

  return reply.status(200).send(configuration);
}

export async function deleteOne(req, reply) {
  const configuration = await fastify.prisma.configuration.delete({
    where: { id: req.params.id as string },
  });

  if (!configuration) {
    return reply.status(400).send('Configuration not deleted');
  }

  return reply.status(200).send(configuration);
}

export const configurationControllers = {
  list,
  create,
  view,
  update,
  deleteOne,
};
