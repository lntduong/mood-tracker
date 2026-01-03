import 'dotenv/config'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

const connectionString = process.env.DATABASE_URL
console.log('Testing Connection to:', connectionString ? 'Defined' : 'Undefined')

if (!connectionString) {
    console.error('DATABASE_URL is missing')
    process.exit(1)
}

const pool = new Pool({ connectionString })
const adapter = new PrismaNeon(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    try {
        console.log('Connecting...')
        await prisma.$connect()
        console.log('Connected!')

        const count = await prisma.user.count()
        console.log('User count:', count)

        await prisma.$disconnect()
        console.log('Disconnected')
    } catch (e) {
        console.error('Connection failed:', e)
        process.exit(1)
    }
}

main()
