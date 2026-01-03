import { MOOD_COLORS, MOOD_LABELS, MOOD_SHORT_LABELS, MOODS } from '@/lib/mood'

export function Legend() {
    return (
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mt-4 w-full md:w-80">
            <h3 className="font-bold text-sm mb-2 underline text-purple-900">Legend:</h3>
            <div className="space-y-1">
                {MOODS.map((mood) => (
                    <div key={mood} className="flex items-center gap-2 text-sm">
                        <div className={`w-6 h-6 flex items-center justify-center text-white text-xs font-bold rounded ${MOOD_COLORS[mood]}`}>
                            {MOOD_SHORT_LABELS[mood]}
                        </div>
                        <span>{MOOD_LABELS[mood]}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
