import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, Mood } from '@prisma/client'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const MOODS: Mood[] = ['A_PLUS', 'A', 'B', 'C', 'D', 'F']

async function main() {
    const email = 'demo@example.com'
    const password = await bcrypt.hash('password123', 10)

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: 'Demo User',
            password,
        },
    })

    console.log({ user })

    // Clear existing moods for demo user
    await prisma.moodEntry.deleteMany({
        where: { userId: user.id },
    })

    // Generate random moods for the current year up to today
    const today = new Date()
    const currentYear = today.getFullYear()
    const startDate = new Date(currentYear, 0, 1)

    const entries = []

    // Loop until yesterday to simulate history
    for (let d = startDate; d < today; d.setDate(d.getDate() + 1)) {
        // 80% chance to have an entry
        if (Math.random() > 0.2) {
            const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)]
            // Normalize to UTC noon
            const dateStr = d.toISOString().split('T')[0]
            const normalizedDate = new Date(`${dateStr}T12:00:00Z`)

            entries.push({
                userId: user.id,
                date: normalizedDate,
                mood: randomMood,
            })
        }
    }

    // Batch insert
    await prisma.moodEntry.createMany({
        data: entries,
    })

    console.log(`Seeded ${entries.length} mood entries for ${user.email}`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
