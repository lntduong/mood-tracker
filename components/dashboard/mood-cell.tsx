'use client'

import { useState } from 'react'
import { Mood, MOOD_COLORS, MOOD_LABELS, MOOD_SHORT_LABELS, MOODS } from '@/lib/mood'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { upsertMood } from '@/actions/mood'
import { toast } from 'sonner'

interface MoodCellProps {
    date: Date
    currentMood?: Mood
    disabled?: boolean
}

export function MoodCell({ date, currentMood, disabled }: MoodCellProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [optimisticMood, setOptimisticMood] = useState<Mood | undefined>(currentMood)

    const handleSelect = async (mood: Mood) => {
        setOptimisticMood(mood)
        setIsOpen(false)
        try {
            // Format date as YYYY-MM-DD using local time components to avoid UTC shift
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const dateStr = `${year}-${month}-${day}`

            await upsertMood(dateStr, mood)
            toast.success('Mood updated')
        } catch (error) {
            setOptimisticMood(currentMood)
            toast.error('Failed to update mood')
        }
    }

    const bgColor = optimisticMood ? MOOD_COLORS[optimisticMood] : 'bg-gray-100 hover:bg-gray-200'
    const label = optimisticMood ? MOOD_SHORT_LABELS[optimisticMood] : ''

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    className={cn(
                        "w-8 h-8 md:w-10 md:h-10 border border-gray-200 flex items-center justify-center text-xs font-bold transition-colors",
                        bgColor,
                        disabled && "opacity-50 cursor-not-allowed",
                        optimisticMood && "text-white"
                    )}
                    disabled={disabled}
                >
                    {label}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="center">
                <div className="grid grid-cols-3 gap-2">
                    {MOODS.map((mood) => (
                        <button
                            key={mood}
                            onClick={() => handleSelect(mood)}
                            className={cn(
                                "w-10 h-10 flex items-center justify-center rounded-md text-white text-xs font-bold hover:scale-105 transition-transform",
                                MOOD_COLORS[mood]
                            )}
                            title={MOOD_LABELS[mood]}
                        >
                            {MOOD_SHORT_LABELS[mood]}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
