// app/reference/route.ts
import { ApiReference } from '@scalar/nextjs-api-reference'

const config = {
  spec: {
    url: '/api.docs.yaml',
  },
}

export const GET = ApiReference(config)