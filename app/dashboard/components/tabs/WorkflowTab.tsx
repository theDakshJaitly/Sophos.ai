'use client';

import { useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface WorkflowTabProps {
  data: { nodes: Array<{ id: string; label: string }>; edges: Array<any> } | null;
}

export function WorkflowTab({ data }: { data: { nodes: Array<{ id: string; label: string }>; edges: any[] } | null }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    if (data) {
      const layoutedNodes: Node[] = data.nodes.map((n, i) => ({
        id: n.id,
        data: { label: n.label },
        position: { x: (i % 5) * 250, y: Math.floor(i / 5) * 120 },
      }));
      setNodes(layoutedNodes);
      setEdges((data.edges || []) as Edge[]);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [data, setNodes, setEdges]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Upload a PDF document to generate a concept map.
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={10} size={1} />
      </ReactFlow>
    </div>
  );
}