export const updateDossier = async (req, reply) => {
    const { id } = req.params
    const { hello } = req.body
  
    reply.code(201).send({ hello: `Hello ${hello}, dossier ID: ${id}` })
  }
  