import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const users = await prisma.user.findMany()
        return res.status(200).json({ users })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to retrieve users' })
    }
}

export const handler = (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        return GET(req, res)
    }

    res.status(405).json({ message: 'Method Not Allowed' })
}
