import { fastify } from '@root/index';

// create full crud for Incident prisma model similar to User, Alert, and Log

export async function list(req, reply) {
  const incidents = await fastify.prisma.incident.findMany();

  if (!incidents) {
    return reply.status(400).send('Incidents not found');
  }

  return reply.status(200).send(incidents);
}

export async function create(req, reply) {
  const incident = await fastify.prisma.incident.create({
    data: {
      title: req.body.title,
      status: req.body.status,
      user: { connect: { id: req.body.userId } },
    },
  });

  if (!incident) {
    return reply.status(400).send('Incident not created');
  }

  return reply.status(200).send(incident);
}

export async function view(req, reply) {
  const incident = await fastify.prisma.incident.findUnique({
    where: { id: req.params.id as string },
  });

  if (!incident) {
    return reply.status(400).send('Incident not found');
  }

  return reply.status(200).send(incident);
}

export async function update(req, reply) {
  const incident = await fastify.prisma.incident.update({
    where: { id: req.params.id as string },
    data: {
      title: req.body.title,
      status: req.body.status,
      user: { connect: { id: req.body.userId } },
    },
  });

  if (!incident) {
    return reply.status(400).send('Incident not updated');
  }

  return reply.status(200).send(incident);
}

export async function deleteOne(req, reply) {
  const incident = await fastify.prisma.incident.delete({
    where: { id: req.params.id as string },
  });

  if (!incident) {
    return reply.status(400).send('Incident not deleted');
  }

  return reply.status(200).send(incident);
}

export const incidentControllers = {
  list,
  create,
  view,
  update,
  deleteOne,
};
