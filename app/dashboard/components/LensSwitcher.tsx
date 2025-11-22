import { Button } from "@/components/ui/button";
import { Network, Calendar, Kanban } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = 'graph' | 'timeline' | 'plan';

interface LensSwitcherProps {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
}

export function LensSwitcher({ viewMode, setViewMode }: LensSwitcherProps) {
    return (
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('graph')}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all",
                    viewMode === 'graph'
                        ? "bg-white dark:bg-gray-700 shadow-sm text-primary"
                        : "text-muted-foreground hover:text-primary"
                )}
            >
                <Network className="h-4 w-4" />
                <span className="text-xs font-medium">Graph</span>
            </Button>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('timeline')}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all",
                    viewMode === 'timeline'
                        ? "bg-white dark:bg-gray-700 shadow-sm text-primary"
                        : "text-muted-foreground hover:text-primary"
                )}
            >
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-medium">Timeline</span>
            </Button>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('plan')}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all",
                    viewMode === 'plan'
                        ? "bg-white dark:bg-gray-700 shadow-sm text-primary"
                        : "text-muted-foreground hover:text-primary"
                )}
            >
                <Kanban className="h-4 w-4" />
                <span className="text-xs font-medium">Plan</span>
            </Button>
        </div>
    );
}
