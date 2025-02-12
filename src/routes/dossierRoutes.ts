import { updateDossier } from '../controllers/dossierController'

export default async function dossierRoutes(fastify : any) {
  fastify.put(
    '/dossier/:id',
    {
      schema: {
        description: 'Update a dossier',
        tags: ['Dossier'],
        summary: 'Update dossier by ID',
        security: [{ apiKey: [] }],
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Dossier ID',
            },
          },
        },
        body: {
          type: 'object',
          properties: {
            hello: { type: 'string' },
            obj: {
              type: 'object',
              properties: {
                some: { type: 'string' },
              },
            },
          },
        },
        response: {
          201: {
            description: 'Successful response',
            type: 'object',
            properties: {
              hello: { type: 'string' },
            },
          },
          default: {
            description: 'Default response',
            type: 'object',
            properties: {
              foo: { type: 'string' },
            },
          },
        },
      },
    },
    updateDossier,
  )
}
