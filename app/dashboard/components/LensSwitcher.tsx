// In app/dashboard/components/LensSwitcher.tsx
"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export type ViewMode = 'graph' | 'timeline' | 'plan'

interface LensSwitcherProps {
    viewMode: ViewMode
    setViewMode: (mode: ViewMode) => void
}

export function LensSwitcher({ viewMode, setViewMode }: LensSwitcherProps) {
    const modes: { value: ViewMode; label: string }[] = [
        { value: 'graph', label: 'Graph' },
        { value: 'timeline', label: 'Timeline' },
        { value: 'plan', label: 'Plan' },
    ]

    return (
        <div className="flex items-center justify-center mb-6">
            <div className="relative inline-flex bg-muted rounded-full p-1 backdrop-blur-sm">
                {modes.map((mode) => (
                    <button
                        key={mode.value}
                        onClick={() => setViewMode(mode.value)}
                        className={cn(
                            "relative px-6 py-2 rounded-full text-sm font-medium transition-colors z-10",
                            viewMode === mode.value
                                ? "text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {viewMode === mode.value && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-primary rounded-full"
                                style={{ zIndex: -1 }}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {mode.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
