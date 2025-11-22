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
import { ViewMode } from '../LensSwitcher';
import { TimelineView } from '../views/TimelineView';
import { PlanView } from '../views/PlanView';
import { motion } from 'framer-motion';

interface WorkflowTabProps {
  data: { nodes: any[]; edges: any[] } | null;
  onNodeClick?: (nodeLabel: string) => void;
  viewMode: ViewMode;
}

export function WorkflowTab({ data, onNodeClick, viewMode }: WorkflowTabProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);

  useEffect(() => {
    if (data && data.nodes?.length) {
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

      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(seedNodes, seedEdges);

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [data, setNodes, setEdges]);

  const handleNodeClick = (_event: React.MouseEvent, node: FlowNode) => {
    const label = node.data.label as string;
    console.log('Node clicked:', label);
    if (onNodeClick) {
      onNodeClick(label);
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Upload a PDF to generate a concept map.
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <motion.div
        key={viewMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 min-h-0"
      >
        {viewMode === 'graph' && (
          <div style={{ height: '100%', width: '100%' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={handleNodeClick}
              fitView
              className="bg-gray-50 dark:bg-gray-900"
            >
              <Controls />
              <MiniMap />
              <Background />
            </ReactFlow>
          </div>
        )}

        {viewMode === 'timeline' && <TimelineView data={data} />}

        {viewMode === 'plan' && <PlanView data={data} />}
      </motion.div>
    </div>
  );
}