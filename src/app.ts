import Fastify from 'fastify'
import FastifySwagger from '@fastify/swagger'
import ScalarApiReference from '@scalar/fastify-api-reference'
import dossierRoutes from './routes/dossierRoutes'
import userRoutes from './routes/userRoutes'

// Instantiate Fastify
const fastify = Fastify({ logger: true })

// Set up Swagger
await fastify.register(FastifySwagger, {
  openapi: {
    info: {
      title: 'My Fastify App',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header',
        },
      },
    },
  },
})

// Register dossier routes with /api/v1 prefix
await fastify.register(dossierRoutes, { prefix: '/api/v1' })

// Register user routes with /api/v1 prefix
await fastify.register(userRoutes, { prefix: '/api/v1' })

// API documentation
await fastify.register(ScalarApiReference, {
  routePrefix: '/docs',
  hooks: {
    onRequest: (request, reply, done) => done(),
    preHandler: (request, reply, done) => done(),
  },
})

// Start server
await fastify.ready()
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`🚀 Server running at ${address}`)
})