'use client'

import { MoodEntry } from '@prisma/client'
import { Mood, MONTHS } from '@/lib/mood'
import { MoodCell } from './mood-cell'

interface MoodGridProps {
    year: number
    moods: MoodEntry[]
}

export function MoodGrid({ year, moods }: MoodGridProps) {
    // Create a map for O(1) lookup
    const moodMap = new Map<string, Mood>()
    moods.forEach((entry) => {
        // entry.date is verified to be a Date object by Next.js if passed from server component correctly
        // but sometimes needs instantiation if generic JSON serialization occurred.
        // However, server components pass Date objects as strings if not careful, but Prisma returns Date objects.
        // NOTE: passing dates from server to client -> they are serialized.
        // We'll construct the key carefully.
        const dateStr = new Date(entry.date).toISOString().split('T')[0]
        moodMap.set(dateStr, entry.mood as Mood)
    })

    // Days 1-31
    const days = Array.from({ length: 31 }, (_, i) => i + 1)

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[800px]">
                {/* Header: Months */}
                <div className="grid grid-cols-[40px_repeat(12,1fr)] gap-1 mb-1">
                    <div className="font-bold text-center"></div>
                    {MONTHS.map((month) => (
                        <div key={month} className="font-bold text-center text-sm bg-blue-100 py-1">
                            {month}
                        </div>
                    ))}
                </div>

                {/* Rows: Days 1-31 */}
                {days.map((day) => (
                    <div key={day} className="grid grid-cols-[40px_repeat(12,1fr)] gap-1 mb-1">
                        <div className="flex items-center justify-center font-bold text-xs bg-purple-100">
                            {day}
                        </div>
                        {MONTHS.map((month, monthIndex) => {
                            // Construct date for this cell
                            // Note: Month is 0-indexed in JS Date
                            const cellDate = new Date(year, monthIndex, day)

                            // Check if date is valid (e.g., Feb 30 is invalid)
                            const isValidDate = cellDate.getMonth() === monthIndex && cellDate.getDate() === day

                            // Also check if future date (optional, but good UX)
                            // For now we allow everything in the current year

                            if (!isValidDate) {
                                return <div key={month} className="bg-black/80" /> // Black box for invalid dates like Feb 30
                            }

                            // Construct date string manually to avoid timezone shift (toISOString() converts 00:00 local to prev day UTC)
                            const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                            const mood = moodMap.get(dateStr)

                            // Check if future date
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            const isFuture = cellDate > today

                            return (
                                <div key={month} className="flex justify-center">
                                    <MoodCell date={cellDate} currentMood={mood} disabled={isFuture} />
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    )
}
