// In app/dashboard/components/views/TimelineView.tsx
"use client"

import { useState, useEffect } from "react"
import { Chrono } from "react-chrono"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface TimelineItem {
    date: string
    title: string
    description: string
}

interface TimelineViewProps {
    data: any
}

export function TimelineView({ data }: TimelineViewProps) {
    const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (data) {
            generateTimeline()
        }
    }, [data])

    const generateTimeline = async () => {
        setIsLoading(true)
        try {
            // TODO: Call backend API to generate timeline from document
            // For now, use mock data
            const mockTimeline: TimelineItem[] = [
                {
                    date: "2024-01-01",
                    title: "Project Inception",
                    description: "Initial concept and planning phase began"
                },
                {
                    date: "2024-03-15",
                    title: "Development Start",
                    description: "Core development team assembled and work commenced"
                },
                {
                    date: "2024-06-30",
                    title: "Beta Release",
                    description: "First beta version released to select users"
                }
            ]

            setTimelineItems(mockTimeline)
        } catch (error) {
            console.error("Error generating timeline:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                Upload a document to generate a timeline.
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Extracting timeline events...</p>
            </div>
        )
    }

    if (timelineItems.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                No timeline events found in this document.
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full p-6 overflow-auto"
        >
            <Chrono
                items={timelineItems.map(item => ({
                    title: item.date,
                    cardTitle: item.title,
                    cardDetailedText: item.description
                }))}
                mode="VERTICAL_ALTERNATING"
                theme={{
                    primary: "hsl(var(--primary))",
                    secondary: "hsl(var(--secondary))",
                    cardBgColor: "hsl(var(--card))",
                    titleColor: "hsl(var(--foreground))",
                    titleColorActive: "hsl(var(--primary))",
                }}
                fontSizes={{
                    cardSubtitle: '0.85rem',
                    cardText: '0.8rem',
                    cardTitle: '1rem',
                    title: '1rem',
                }}
            />
        </motion.div>
    )
}
