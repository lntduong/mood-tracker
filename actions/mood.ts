'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Mood } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function getMoods(year: number) {
    const session = await auth()
    if (!session?.user?.id) return []

    // Use UTC dates for querying to match how we store them
    const startDate = new Date(Date.UTC(year, 0, 1))
    const endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59))

    const moods = await prisma.moodEntry.findMany({
        where: {
            userId: session.user.id,
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
    })

    return moods
}

export async function upsertMood(dateStr: string, mood: Mood) {
    const session = await auth()
    if (!session?.user?.id) throw new Error('Unauthorized')

    // Construct Date object at UTC noon from the string (YYYY-MM-DD)
    // This ensures that "2026-01-01" becomes "2026-01-01T12:00:00.000Z"
    const normalizedDate = new Date(`${dateStr}T12:00:00Z`)

    await prisma.moodEntry.upsert({
        where: {
            userId_date: {
                userId: session.user.id,
                date: normalizedDate,
            },
        },
        update: {
            mood,
        },
        create: {
            userId: session.user.id,
            date: normalizedDate,
            mood,
        },
    })

    revalidatePath('/dashboard')
}
