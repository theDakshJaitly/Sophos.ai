'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DraggableActionItem } from './DraggableActionItem';
import { X } from 'lucide-react';

interface TodoListPanelProps {
    todos: any[];
    checkedTodos: Set<string>;
    onToggleCheck: (todoId: string) => void;
    onRemove: (todoId: string) => void;
}

export function TodoListPanel({ todos, checkedTodos, onToggleCheck, onRemove }: TodoListPanelProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'todo-dropzone',
    });

    return (
        <div className="h-full overflow-auto p-4">
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">✓ My To-Do List</h3>
                <p className="text-xs text-muted-foreground">Drag items here from the action plan</p>
            </div>

            <div
                ref={setNodeRef}
                className={`
          min-h-[200px] rounded-lg border-2 border-dashed p-4 space-y-2
          transition-all duration-200
          ${isOver
                        ? 'border-primary bg-primary/5 scale-[1.02]'
                        : 'border-gray-300 dark:border-gray-700'
                    }
        `}
            >
                {todos.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-center">
                        <p className="text-sm text-muted-foreground">
                            Drag action items here<br />to create your to-do list
                        </p>
                    </div>
                ) : (
                    <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        {todos.map((todo) => (
                            <div key={todo.id} className="relative group">
                                <DraggableActionItem
                                    step={todo}
                                    isChecked={checkedTodos.has(todo.id)}
                                    onToggleCheck={() => onToggleCheck(todo.id)}
                                    isDraggable={false}
                                />
                                {/* Remove Button */}
                                <button
                                    onClick={() => onRemove(todo.id)}
                                    className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100
                    transition-opacity bg-red-500 hover:bg-red-600 text-white
                    rounded-full p-1 shadow-lg"
                                    title="Remove from list"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </SortableContext>
                )}
            </div>
        </div>
    );
}
