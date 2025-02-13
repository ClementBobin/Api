import prisma from '../lib/PrismaClient.js';
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json({ users });
    }
    catch (error) {
        res.status(500).json({ error: 'Unable to fetch users' });
    }
};
