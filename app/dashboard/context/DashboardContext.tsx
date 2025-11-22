// In app/dashboard/context/DashboardContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface DashboardContextType {
    chatMessage: string;
    setChatMessage: (message: string) => void;
    triggerChatSubmit: boolean;
    setTriggerChatSubmit: (trigger: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
    const [chatMessage, setChatMessage] = useState('');
    const [triggerChatSubmit, setTriggerChatSubmit] = useState(false);

    return (
        <DashboardContext.Provider
            value={{
                chatMessage,
                setChatMessage,
                triggerChatSubmit,
                setTriggerChatSubmit,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
}
