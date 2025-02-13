import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Target } from 'lucide-react';

const initialNodes = [
  { id: '1', position: { x: 350, y: 0 }, data: { label: 'Linear Algebra' } },
  { id: '2', position: { x: 100, y: 200 }, data: { label: 'Linear Regression' } },
  { id: '3', position: { x: 350, y: 100 }, data: { label: 'Machine Learning' } },
  { id: '4', position: { x: 170, y: 350 }, data: { label: 'Random Forest' } },
  { id: '5', position: { x: 600, y: 50 }, data: { label: 'Statistics' } },
  { id: '6', position: { x: 600, y: 200 }, data: { label: 'AI Ethics' } },
];

const initialEdges = [
    { id: 'e1-3', source: '1', target: '3',  }, 
    { id: 'e3-2', source : '3', target: '2' },
    { id: 'e2-4', source : '2', target: '4' },
    { id: 'e3-6', source : '3', target: '6' },
    { id: 'e1-5', source : '1', target: '5' }
];

export function WorkflowTab() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={10} size={1} />
      </ReactFlow>
    </div>
  );
}