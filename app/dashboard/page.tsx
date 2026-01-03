import { auth } from '@/lib/auth'
import { getMoods } from '@/actions/mood'
import { MoodGrid } from '@/components/dashboard/mood-grid'
import { StatsPanel } from '@/components/dashboard/stats-panel'
import { Legend } from '@/components/dashboard/legend'

import { SignOutButton } from '@/components/auth/sign-out-button'

export default async function DashboardPage() {
    const session = await auth()
    const currentYear = new Date().getFullYear()
    const moods = await getMoods(currentYear)

    return (
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-cyan-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
                    {currentYear} Mood Tracker
                </h1>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                        Welcome, {session?.user?.name || session?.user?.email}
                    </div>
                    <SignOutButton />
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-8 items-start">
                {/* Left: Grid - Takes available space */}
                <div className="flex-1 w-full overflow-hidden bg-white p-4 rounded-lg shadow-sm border">
                    <MoodGrid year={currentYear} moods={moods} />
                </div>

                {/* Right: Stats & Legend - Fixed width on desktop */}
                <div className="w-full xl:w-auto flex flex-col gap-4">
                    <StatsPanel moods={moods} />
                    <Legend />
                </div>
            </div>
        </div>
    )
}
