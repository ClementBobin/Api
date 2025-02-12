import Fastify from 'fastify'
import FastifySwagger from '@fastify/swagger'
import FastifyStatic from '@fastify/static'
import ScalarApiReference from '@scalar/fastify-api-reference'
import path from 'path'
import { fileURLToPath } from 'url'
import dossierRoutes from './routes/dossierRoutes.ts'
import userRoutes from './routes/userRoutes.ts'

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

// Register dossier routes
await fastify.register(dossierRoutes)

// R
await fastify.register(userRoutes)

// Static file serving
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

fastify.register(FastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
})

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
