import { fastify, saltRounds } from '@root/index';
import { FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';

export async function create(req, reply) {
  const user = await fastify.prisma.user.create({
    data: {
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, saltRounds),
      roles: { create: { name: req.body.role } },
    },
  });

  if (!user) {
    return reply.status(400).send('User not created');
  }

  return reply.status(200).send(user);
}

export async function list(req, reply) {
  const users = await fastify.prisma.user.findMany({
    include: { roles: true },
  });

  if (!users) {
    return reply.status(400).send('Users not found');
  }

  return reply.status(200).send(users);
}

export async function view(req, reply) {
  const user = await fastify.prisma.user.findUnique({
    where: { id: req.params.id },
    include: {
      roles: true,
      tokens: true,
      logs: true,
      alerts: true,
      incidents: true,
    },
  });

  if (!user) {
    return reply.status(400).send('User not found');
  }

  return reply.status(200).send(user);
}

export async function update(req, reply) {
  const user = await fastify.prisma.user.update({
    where: { id: req.params.id },
    data: {
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, saltRounds),
      roles: { create: { name: req.body.role } },
    },
  });

  if (!user) {
    return reply.status(400).send('User not updated');
  }

  return reply.status(200).send(user);
}

export async function deleteOne(req, reply) {
  const user = await fastify.prisma.user.delete({
    where: { id: req.params.id },
  });

  if (!user) {
    return reply.status(400).send('User not deleted');
  }

  return reply.status(200).send(user);
}

export const userControllers = {
  list,
  create,
  view,
  update,
  deleteOne,
};
