// In app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { RightPanel } from './components/RightPanel';
import { Node, Edge } from '@xyflow/react';

// Define a type for our concept map data for type safety
export interface UploadedFile {
  id: string;
  name: string;
}

export interface WorkflowData {
  nodes: InputNode[];
  edges: InputEdge[];
}

interface InputNode {
  id: string;
  label: string;
  position: { x: number; y: number };
}

interface InputEdge {
  id: string;
  source: string;
  target: string;
}

export default function DashboardPage() {
  const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentUploads, setRecentUploads] = useState<UploadedFile[]>([]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar 
      setWorkflowData={setWorkflowData}
      setIsLoading={setIsLoading}
      recentUploads={recentUploads}
      setRecentUploads={setRecentUploads}
       />
      <MainContent workflowData={workflowData} isLoading={isLoading} />
      <RightPanel />
    </div>
  );
}
