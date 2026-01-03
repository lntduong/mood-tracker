'use client'

import { MoodEntry } from '@prisma/client'
import { Mood, MOOD_COLORS, MOOD_LABELS, MOOD_SHORT_LABELS, MOODS } from '@/lib/mood'

interface StatsPanelProps {
    moods: MoodEntry[]
}

export function StatsPanel({ moods }: StatsPanelProps) {
    const total = moods.length

    const stats = MOODS.map((mood) => {
        const count = moods.filter((m) => m.mood === mood).length
        const percentage = total > 0 ? (count / total) * 100 : 0
        return {
            mood,
            count,
            percentage,
        }
    })

    return (
        <div className="bg-white p-4 rounded-lg border shadow-sm w-full md:w-80">
            <h3 className="font-bold text-lg mb-4 text-center border-b pb-2">Statistics</h3>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b">
                        <th className="text-left py-1">Mood</th>
                        <th className="text-right py-1">Days</th>
                        <th className="text-right py-1">%</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.map((stat) => (
                        <tr key={stat.mood} className="border-b last:border-0">
                            <td className="py-2 flex items-center gap-2">
                                <div className={`w-6 h-6 flex items-center justify-center text-white text-xs font-bold rounded ${MOOD_COLORS[stat.mood]}`}>
                                    {MOOD_SHORT_LABELS[stat.mood]}
                                </div>
                            </td>
                            <td className="text-right py-2 font-mono">
                                {stat.count.toString().padStart(3, '0')}
                            </td>
                            <td className="text-right py-2 font-mono relative w-24">
                                <div className="flex items-center justify-end z-10 relative">
                                    {stat.percentage.toFixed(2)}%
                                </div>
                                {/* Progress bar background */}
                                <div
                                    className={`absolute top-2 right-0 h-4 opacity-30 rounded-l ${MOOD_COLORS[stat.mood]}`}
                                    style={{ width: `${stat.percentage}%`, height: '60%' }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
