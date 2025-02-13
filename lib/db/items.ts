import prisma from '@/lib/client'

// Create the item
export async function createItem(requestBody: { name: string }) {
    return await prisma.items.create({
        data: {
            name: requestBody.name,
        },
    })
}