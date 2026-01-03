import { prisma } from './lib/prisma'

async function main() {
    try {
        // Attempt to select specific fields to see if they exist in schema/DB mapping
        // This doesn't strictly check DB schema, but checks if Prisma Client can access it.
        // If migration failed or wasn't applied, this might throw or return generic data.

        // Better: raw query to check columns
        const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'User' AND column_name = 'password';
    `
        console.log('Password column check:', result)

        const userCount = await prisma.user.count()
        console.log('User count:', userCount)

    } catch (e) {
        console.error('Schema check error:', e)
    }
}

main()
