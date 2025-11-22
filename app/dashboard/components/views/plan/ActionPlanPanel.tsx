'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { DraggableActionItem } from './DraggableActionItem';

interface ActionPlanPanelProps {
    actionPlan: any;
    checkedSteps: Set<string>;
    onToggleCheck: (stepId: string) => void;
}

export function ActionPlanPanel({ actionPlan, checkedSteps, onToggleCheck }: ActionPlanPanelProps) {
    const [collapsedPhases, setCollapsedPhases] = useState<Set<string>>(new Set());

    const togglePhase = (phaseId: string) => {
        const newCollapsed = new Set(collapsedPhases);
        if (newCollapsed.has(phaseId)) {
            newCollapsed.delete(phaseId);
        } else {
            newCollapsed.add(phaseId);
        }
        setCollapsedPhases(newCollapsed);
    };

    if (!actionPlan || !actionPlan.phases || actionPlan.phases.length === 0) {
        return (
            <div className="h-full flex items-center justify-center p-6">
                <p className="text-sm text-muted-foreground text-center">
                    No action plan available for this document.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-auto p-4 space-y-4">
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-1">📋 Action Plan</h3>
                <p className="text-xs text-muted-foreground">From your document</p>
            </div>

            {actionPlan.phases.map((phase: any) => {
                const isCollapsed = collapsedPhases.has(phase.id);
                const phaseSteps = phase.steps || [];
                const checkedCount = phaseSteps.filter((s: any) => checkedSteps.has(s.id)).length;

                return (
                    <div key={phase.id} className="space-y-2">
                        {/* Phase Header */}
                        <button
                            onClick={() => togglePhase(phase.id)}
                            className="w-full flex items-center gap-2 p-3 rounded-lg
                backdrop-blur-lg bg-white/10 dark:bg-gray-900/20
                border border-white/20 dark:border-gray-700/30
                hover:bg-white/15 dark:hover:bg-gray-900/25
                transition-all"
                        >
                            {isCollapsed ? (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div className="flex-1 text-left">
                                <h4 className="font-semibold text-sm">{phase.title}</h4>
                                {phase.description && (
                                    <p className="text-xs text-muted-foreground mt-0.5">{phase.description}</p>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {checkedCount}/{phaseSteps.length}
                            </span>
                        </button>

                        {/* Phase Steps */}
                        {!isCollapsed && (
                            <div className="ml-6 space-y-2">
                                {phaseSteps.map((step: any) => (
                                    <DraggableActionItem
                                        key={step.id}
                                        step={step}
                                        isChecked={checkedSteps.has(step.id)}
                                        onToggleCheck={() => onToggleCheck(step.id)}
                                        isDraggable={true}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
