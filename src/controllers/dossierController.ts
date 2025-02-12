import { FastifyRequest, FastifyReply } from 'fastify';

export const updateDossier = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string }
    const { hello } = req.body as { hello: string }
  
    reply.code(201).send({ hello: `Hello ${hello}, dossier ID: ${id}` })
  }
  