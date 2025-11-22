'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimelineEventProps {
    event: {
        id: string;
        sequence: number;
        date?: string | null;
        title: string;
        description: string;
        entities: string[];
        category?: string;
        importance: 'low' | 'medium' | 'high';
    };
    showDate: boolean;
    categoryColor: string;
}

const importanceColors = {
    high: 'from-red-500 to-orange-500',
    medium: 'from-blue-500 to-purple-500',
    low: 'from-gray-400 to-slate-400'
};

export function TimelineEvent({ event, showDate, categoryColor }: TimelineEventProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="relative group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Event Card */}
            <div className="flex items-start gap-4">
                {/* Timeline Dot */}
                <div className="relative flex-shrink-0 mt-1.5">
                    <div
                        className={`w-4 h-4 rounded-full bg-gradient-to-br ${importanceColors[event.importance]} 
            ring-4 ring-white dark:ring-gray-900 shadow-lg transition-transform group-hover:scale-125`}
                    />
                </div>

                {/* Event Content */}
                <div
                    className="flex-1 backdrop-blur-lg bg-white/10 dark:bg-gray-900/20 
          border border-white/20 dark:border-gray-700/30 rounded-lg p-4 
          shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer
          hover:bg-white/20 dark:hover:bg-gray-900/30"
                    style={{ borderLeftColor: categoryColor, borderLeftWidth: '3px' }}
                >
                    {/* Title and Date/Sequence */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-base text-foreground">{event.title}</h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {showDate && event.date ? event.date : `Event ${event.sequence}`}
                        </span>
                    </div>

                    {/* Brief Description (Always visible) */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {event.description}
                    </p>

                    {/* Hover Tooltip - Expanded Details */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-3 pt-3 border-t border-white/10 dark:border-gray-700/30 space-y-2"
                            >
                                {/* Full Description */}
                                <p className="text-sm text-foreground">{event.description}</p>

                                {/* Entities */}
                                {event.entities && event.entities.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-1">Entities:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {event.entities.map((entity, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs px-2 py-0.5 rounded-full 
                          bg-primary/10 text-primary border border-primary/20"
                                                >
                                                    {entity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Category */}
                                {event.category && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-muted-foreground">Category:</span>
                                        <span
                                            className="text-xs px-2 py-0.5 rounded-full border"
                                            style={{
                                                borderColor: categoryColor,
                                                color: categoryColor,
                                                backgroundColor: `${categoryColor}15`
                                            }}
                                        >
                                            {event.category}
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
