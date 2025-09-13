// In app/dashboard/components/tabs/WorkflowTab.tsx
'use client';

import { useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node as FlowNode,
  Edge as FlowEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { getLayoutedElements } from '@/lib/layout'; 

interface WorkflowTabProps {
  data: { nodes: any[]; edges: any[] } | null;
}

export function WorkflowTab({ data }: WorkflowTabProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);

  useEffect(() => {
    if (data && data.nodes?.length) {
      console.log('Raw data received:', data); // Debug log
      
      // Convert backend data to React Flow format
      const seedNodes: FlowNode[] = data.nodes.map((n) => ({
        id: n.id,
        data: { label: n.label },
        position: { x: 0, y: 0 }, // Will be overridden by layout
      }));
      
      const seedEdges: FlowEdge[] = data.edges.map((e, i) => ({
        id: e.id || `e-${e.source}-${e.target}-${i}`,
        source: e.source,
        target: e.target,
        label: e.label || '',
      }));

      console.log('Converted nodes:', seedNodes); // Debug log
      console.log('Converted edges:', seedEdges); // Debug log

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(seedNodes, seedEdges);
      
      console.log('Layouted nodes:', layoutedNodes); // Debug log
      console.log('Layouted edges:', layoutedEdges); // Debug log
      
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    } else {
      console.log('No data or empty nodes array'); // Debug log
      setNodes([]);
      setEdges([]);
    }
  }, [data, setNodes, setEdges]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Upload a PDF to generate a concept map.
      </div>
    );
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        className="bg-gray-50 dark:bg-gray-900"
      >
        <Controls />
        <MiniMap />
        <Background />
      </ReactFlow>
    </div>
  );
}