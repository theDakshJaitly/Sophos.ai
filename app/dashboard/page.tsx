// In app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { RightPanel } from './components/RightPanel';
import { Node, Edge } from '@xyflow/react';

// Define a type for our concept map data for type safety
export interface WorkflowData {
  nodes: Node[];
  edges: Edge[];
}

export default function DashboardPage() {
  const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar setWorkflowData={setWorkflowData} />
      <MainContent workflowData={workflowData} />
      <RightPanel />
    </div>
  );
}
