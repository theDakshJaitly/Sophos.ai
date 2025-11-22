'use client';

import { TimelineEvent } from './TimelineEvent';

interface TimelineSwimlaneProps {
    category: string;
    events: any[];
    color: string;
    showDate: boolean;
}

export function TimelineSwimlane({ category, events, color, showDate }: TimelineSwimlaneProps) {
    return (
        <div className="relative">
            {/* Category Label */}
            <div className="flex items-center gap-3 mb-4">
                <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                />
                <h3 className="text-sm font-semibold text-foreground capitalize">{category}</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-gray-300 dark:from-gray-700 to-transparent" />
            </div>

            {/* Events List */}
            <div className="space-y-4 ml-6 relative">
                {/* Connecting Line */}
                <div
                    className="absolute left-2 top-0 bottom-0 w-0.5 opacity-30"
                    style={{ background: `linear-gradient(to bottom, ${color}, transparent)` }}
                />

                {/* Events */}
                {events.map((event, index) => (
                    <TimelineEvent
                        key={event.id || index}
                        event={event}
                        showDate={showDate}
                        categoryColor={color}
                    />
                ))}
            </div>
        </div>
    );
}
