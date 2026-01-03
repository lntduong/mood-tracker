export const MOODS = ['A_PLUS', 'A', 'B', 'C', 'D', 'F'] as const
export type Mood = typeof MOODS[number]

export const MOOD_LABELS: Record<Mood, string> = {
    A_PLUS: 'Positive core memory',
    A: 'Very positive',
    B: 'Positive',
    C: 'Neutral',
    D: 'Negative',
    F: 'Very negative',
}

export const MOOD_COLORS: Record<Mood, string> = {
    A_PLUS: 'bg-emerald-600',
    A: 'bg-emerald-500',
    B: 'bg-green-400',
    C: 'bg-yellow-400',
    D: 'bg-orange-500',
    F: 'bg-red-600',
}

// Map for display text in grid
export const MOOD_SHORT_LABELS: Record<Mood, string> = {
    A_PLUS: 'A+',
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D',
    F: 'F',
}

export const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]
