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
import { WorkflowData } from '../../page';
import { getLayoutedElements } from '@/lib/layout'; // 👈 Import our new layout helper

interface WorkflowTabProps {
  data: WorkflowData | null;
}

type InputNode = { id: string; label: string; position?: { x: number; y: number } };
type InputEdge = { id?: string; source: string; target: string; label?: string };

export function WorkflowTab({ data }: { data: { nodes: InputNode[]; edges: InputEdge[] } | null }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);

  useEffect(() => {
    if (data && data.nodes?.length) {
      const seedNodes: FlowNode[] = data.nodes.map((n, i) => ({
        id: n.id,
        data: { label: n.label },
        position: n.position ?? { x: 0, y: 0 },
      }));
      const seedEdges: FlowEdge[] = data.edges.map((e, i) => ({
        id: e.id ?? `e-${e.source}-${e.target}-${i}`,
        source: e.source,
        target: e.target,
        label: e.label,
      }) as FlowEdge);

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(seedNodes, seedEdges);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    } else {
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