'use client';

import { useMemo } from 'react';
import { TimelineSwimlane } from './timeline/TimelineSwimlane';

// Color palette for categories
const CATEGORY_COLORS = [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#a855f7', // Purple
    '#f59e0b', // Orange
    '#ef4444', // Red
    '#06b6d4', // Cyan
    '#8b5cf6', // Violet
    '#ec4899', // Pink
];

interface TimelineEvent {
    id: string;
    sequence: number;
    date?: string | null;
    title: string;
    description: string;
    entities: string[];
    category?: string;
    importance: 'low' | 'medium' | 'high';
}

export function TimelineView({ data }: { data: any }) {
    // Extract timeline events from data
    const events: TimelineEvent[] = useMemo(() => {
        if (!data?.timeline || !Array.isArray(data.timeline)) {
            return [];
        }
        return data.timeline;
    }, [data]);

    // Determine if document has dates
    const hasExplicitDates = useMemo(() => {
        return events.some(event => event.date);
    }, [events]);

    // Group events by category
    const eventsByCategory = useMemo(() => {
        const grouped: Record<string, TimelineEvent[]> = {};

        events.forEach(event => {
            const category = event.category || 'Uncategorized';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(event);
        });

        // Sort events within each category by sequence
        Object.keys(grouped).forEach(category => {
            grouped[category].sort((a, b) => a.sequence - b.sequence);
        });

        return grouped;
    }, [events]);

    // Assign colors to categories
    const categoryColors = useMemo(() => {
        const categories = Object.keys(eventsByCategory);
        const colors: Record<string, string> = {};

        categories.forEach((category, index) => {
            colors[category] = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
        });

        return colors;
    }, [eventsByCategory]);

    // Empty state
    if (events.length === 0) {
        return (
            <div className="h-full p-6 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <h3 className="text-lg font-semibold mb-2">No Timeline Events</h3>
                    <p className="text-sm text-muted-foreground">
                        No chronological events were detected in this document.
                        Timeline view works best with documents that have temporal progression or explicit dates.
                    </p>
                </div>
            </div>
        );
    }

    const categories = Object.keys(eventsByCategory);
    const isSingleCategory = categories.length === 1;

    return (
        <div className="h-full p-6 overflow-auto">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-2xl font-bold mb-1">Timeline View</h3>
                <p className="text-sm text-muted-foreground">
                    {hasExplicitDates ? 'Chronological events with dates' : 'Sequential event progression'}
                    {!isSingleCategory && ` • ${categories.length} storylines`}
                </p>
            </div>

            {/* Timeline Content */}
            <div className="space-y-8">
                {categories.map(category => (
                    <TimelineSwimlane
                        key={category}
                        category={category}
                        events={eventsByCategory[category]}
                        color={categoryColors[category]}
                        showDate={hasExplicitDates}
                    />
                ))}
            </div>
        </div>
    );
}
