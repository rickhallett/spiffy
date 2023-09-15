import { fastify } from '@root/index';

export async function list(req, reply) {
  const assets = await fastify.prisma.asset.findMany();

  if (!assets) {
    return reply.status(400).send('Assets not found');
  }

  return reply.status(200).send(assets);
}

export async function create(req, reply) {
  const asset = await fastify.prisma.asset.create({
    data: {
      name: req.body.name,
      type: req.body.type,
      // Configuration: { create: { name: req.body.configurationName, value: req.body.configurationValue, asset: { connect: { id: req.body.assetId } } }
    },
  });

  if (!asset) {
    return reply.status(400).send('Asset not created');
  }

  return reply.status(200).send(asset);
}

export async function view(req, reply) {
  const asset = await fastify.prisma.asset.findUnique({
    where: { id: req.params.id as string },
  });

  if (!asset) {
    return reply.status(400).send('Asset not found');
  }

  return reply.status(200).send(asset);
}

export async function update(req, reply) {
  const asset = await fastify.prisma.asset.update({
    where: { id: req.params.id as string },
    data: {
      name: req.body.name,
      type: req.body.type,
    },
  });

  if (!asset) {
    return reply.status(400).send('Asset not updated');
  }

  return reply.status(200).send(asset);
}

export async function deleteOne(req, reply) {
  const asset = await fastify.prisma.asset.delete({
    where: { id: req.params.id as string },
  });

  if (!asset) {
    return reply.status(400).send('Asset not deleted');
  }

  return reply.status(200).send(asset);
}

export const assetControllers = {
  list,
  create,
  view,
  update,
  deleteOne,
};
