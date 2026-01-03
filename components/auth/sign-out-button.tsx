"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export function SignOutButton() {
    return (
        <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
            title="Sign Out"
        >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Sign Out</span>
        </button>
    )
}
