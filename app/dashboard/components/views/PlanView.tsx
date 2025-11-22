'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, closestCorners } from '@dnd-kit/core';
import { ActionPlanPanel } from './plan/ActionPlanPanel';
import { TodoListPanel } from './plan/TodoListPanel';
import { DraggableActionItem } from './plan/DraggableActionItem';

const STORAGE_KEYS = {
    CHECKED_STEPS: 'sophos_action_plan_checked',
    TODOS: 'sophos_todo_list',
    CHECKED_TODOS: 'sophos_todo_checked',
};

export function PlanView({ data }: { data: any }) {
    // Debug: Log what data we're receiving
    useEffect(() => {
        console.log('PlanView received data:', data);
        console.log('Action plan:', data?.actionPlan);
        console.log('Action plan phases:', data?.actionPlan?.phases);
    }, [data]);

    // Initialize from sessionStorage
    const [checkedSteps, setCheckedSteps] = useState<Set<string>>(() => {
        if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem(STORAGE_KEYS.CHECKED_STEPS);
            if (stored) {
                try {
                    return new Set(JSON.parse(stored));
                } catch (e) {
                    console.error('Failed to parse checked steps:', e);
                }
            }
        }
        return new Set();
    });

    const [todos, setTodos] = useState<any[]>(() => {
        if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem(STORAGE_KEYS.TODOS);
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch (e) {
                    console.error('Failed to parse todos:', e);
                }
            }
        }
        return [];
    });

    const [checkedTodos, setCheckedTodos] = useState<Set<string>>(() => {
        if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem(STORAGE_KEYS.CHECKED_TODOS);
            if (stored) {
                try {
                    return new Set(JSON.parse(stored));
                } catch (e) {
                    console.error('Failed to parse checked todos:', e);
                }
            }
        }
        return new Set();
    });

    const [activeId, setActiveId] = useState<string | null>(null);

    // Persist to sessionStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(STORAGE_KEYS.CHECKED_STEPS, JSON.stringify([...checkedSteps]));
        }
    }, [checkedSteps]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
        }
    }, [todos]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem(STORAGE_KEYS.CHECKED_TODOS, JSON.stringify([...checkedTodos]));
        }
    }, [checkedTodos]);

    // Find step by ID across all phases
    const findStep = (stepId: string) => {
        if (!data?.actionPlan?.phases) return null;
        for (const phase of data.actionPlan.phases) {
            const step = phase.steps?.find((s: any) => s.id === stepId);
            if (step) return step;
        }
        return null;
    };

    // Drag handlers
    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over?.id === 'todo-dropzone') {
            const step = findStep(active.id as string);
            if (step) {
                // Check if already in todo list
                const exists = todos.some(t => t.id === step.id);
                if (!exists) {
                    setTodos(prev => [...prev, step]);
                }
            }
        }

        setActiveId(null);
    };

    const handleToggleStepCheck = (stepId: string) => {
        const newChecked = new Set(checkedSteps);
        if (newChecked.has(stepId)) {
            newChecked.delete(stepId);
        } else {
            newChecked.add(stepId);
        }
        setCheckedSteps(newChecked);
    };

    const handleToggleTodoCheck = (todoId: string) => {
        const newChecked = new Set(checkedTodos);
        if (newChecked.has(todoId)) {
            newChecked.delete(todoId);
        } else {
            newChecked.add(todoId);
        }
        setCheckedTodos(newChecked);
    };

    const handleRemoveTodo = (todoId: string) => {
        setTodos(prev => prev.filter(t => t.id !== todoId));
        // Also remove from checked if it was checked
        const newChecked = new Set(checkedTodos);
        newChecked.delete(todoId);
        setCheckedTodos(newChecked);
    };

    const activeStep = activeId ? findStep(activeId) : null;

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
        >
            <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                {/* Left Panel - Action Plan */}
                <div className="backdrop-blur-lg bg-white/5 dark:bg-gray-900/10 
          border border-white/10 dark:border-gray-700/20 rounded-lg overflow-hidden">
                    <ActionPlanPanel
                        actionPlan={data?.actionPlan}
                        checkedSteps={checkedSteps}
                        onToggleCheck={handleToggleStepCheck}
                    />
                </div>

                {/* Right Panel - Todo List */}
                <div className="backdrop-blur-lg bg-white/5 dark:bg-gray-900/10 
          border border-white/10 dark:border-gray-700/20 rounded-lg overflow-hidden">
                    <TodoListPanel
                        todos={todos}
                        checkedTodos={checkedTodos}
                        onToggleCheck={handleToggleTodoCheck}
                        onRemove={handleRemoveTodo}
                    />
                </div>
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
                {activeStep ? (
                    <div className="opacity-80">
                        <DraggableActionItem
                            step={activeStep}
                            isChecked={checkedSteps.has(activeStep.id)}
                            onToggleCheck={() => { }}
                            isDraggable={false}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
