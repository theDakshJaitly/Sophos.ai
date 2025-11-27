"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { ViewMode } from "../components/LensSwitcher";

export type ActiveMode = 'workflow' | 'chat' | 'notes' | 'quiz';

interface DashboardContextType {
    chatMessage: string;
    setChatMessage: (message: string) => void;
    triggerChatSubmit: boolean;
    setTriggerChatSubmit: (trigger: boolean) => void;
    activeMode: ActiveMode;
    setActiveMode: (mode: ActiveMode) => void;
    workflowSubView: ViewMode;
    setWorkflowSubView: (view: ViewMode) => void;
    leftSidebarCollapsed: boolean;
    toggleLeftSidebar: () => void;
    rightPanelCollapsed: boolean;
    toggleRightPanel: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
    const [chatMessage, setChatMessage] = useState("");
    const [triggerChatSubmit, setTriggerChatSubmit] = useState(false);
    const [activeMode, setActiveMode] = useState<ActiveMode>('workflow');
    const [workflowSubView, setWorkflowSubView] = useState<ViewMode>('graph');
    const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
    const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

    const toggleLeftSidebar = () => setLeftSidebarCollapsed(prev => !prev);
    const toggleRightPanel = () => setRightPanelCollapsed(prev => !prev);

    return (
        <DashboardContext.Provider value={{
            chatMessage,
            setChatMessage,
            triggerChatSubmit,
            setTriggerChatSubmit,
            activeMode,
            setActiveMode,
            workflowSubView,
            setWorkflowSubView,
            leftSidebarCollapsed,
            toggleLeftSidebar,
            rightPanelCollapsed,
            toggleRightPanel
        }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
}
