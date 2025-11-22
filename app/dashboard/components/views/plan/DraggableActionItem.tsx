'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface DraggableActionItemProps {
    step: {
        id: string;
        text: string;
        priority: 'low' | 'medium' | 'high';
        estimated_effort?: string;
    };
    isChecked: boolean;
    onToggleCheck: () => void;
    isDraggable?: boolean;
}

const priorityColors = {
    high: 'from-red-500 to-orange-500',
    medium: 'from-blue-500 to-purple-500',
    low: 'from-gray-400 to-slate-400'
};

export function DraggableActionItem({ step, isChecked, onToggleCheck, isDraggable = true }: DraggableActionItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: step.id, disabled: !isDraggable });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
        flex items-center gap-3 p-3 rounded-lg
        backdrop-blur-lg bg-white/5 dark:bg-gray-900/10
        border border-white/10 dark:border-gray-700/20
        hover:bg-white/10 dark:hover:bg-gray-900/20
        transition-all duration-200
        ${isDragging ? 'shadow-2xl scale-105' : 'shadow-sm'}
      `}
        >
            {/* Drag Handle */}
            {isDraggable && (
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                >
                    <GripVertical className="h-4 w-4" />
                </div>
            )}

            {/* Checkbox */}
            <input
                type="checkbox"
                checked={isChecked}
                onChange={onToggleCheck}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm ${isChecked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {step.text}
                </p>
                {step.estimated_effort && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Est: {step.estimated_effort}
                    </p>
                )}
            </div>

            {/* Priority Badge */}
            <div
                className={`
          px-2 py-0.5 rounded-full text-xs font-medium
          bg-gradient-to-r ${priorityColors[step.priority]}
          text-white
        `}
            >
                {step.priority}
            </div>
        </div>
    );
}
