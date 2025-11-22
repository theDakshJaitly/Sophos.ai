// In app/dashboard/components/tabs/WorkflowTab.tsx
'use client';

import { useEffect, useState } from 'react';
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
import { NodeInfoBox } from '../NodeInfoBox';
import { motion } from 'framer-motion';

interface WorkflowTabProps {
  data: { nodes: any[]; edges: any[] } | null;
  onNodeClick?: (nodeLabel: string) => void;
  viewMode: ViewMode;
}

export function WorkflowTab({ data, onNodeClick, viewMode }: WorkflowTabProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);
  const [selectedNode, setSelectedNode] = useState<{ id: string; label: string; description?: string; source?: string } | null>(null);
  const [infoBoxPosition, setInfoBoxPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (data && data.nodes?.length) {
      const seedNodes: FlowNode[] = data.nodes.map((n) => ({
        id: n.id,
        data: {
          label: n.label,
          description: n.description,
          source: n.source,
        },
        position: { x: 0, y: 0 },
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

  const handleNodeClick = (event: React.MouseEvent, node: FlowNode) => {
    if (viewMode !== 'graph') return; // Only show info box in graph view

    const label = node.data.label as string;
    const description = node.data.description as string | undefined;
    const source = node.data.source as string | undefined;

    console.log('Node clicked:', label);

    // Calculate position based on click event
    setInfoBoxPosition({ x: event.clientX, y: event.clientY });
    setSelectedNode({ id: node.id, label, description, source });
  };

  const handleCloseInfoBox = () => {
    setSelectedNode(null);
  };

  const handleChatAboutNode = () => {
    if (selectedNode && onNodeClick) {
      onNodeClick(selectedNode.label);
      setSelectedNode(null); // Close info box
    }
  };

  const handlePaneClick = () => {
    // Close info box when clicking on background
    setSelectedNode(null);
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
              onPaneClick={handlePaneClick}
              fitView
              className="bg-gray-50 dark:bg-gray-900"
            >
              <Controls />
              <MiniMap />
              <Background />
            </ReactFlow>

            {/* Node Info Box */}
            {selectedNode && (
              <NodeInfoBox
                node={selectedNode}
                position={infoBoxPosition}
                onClose={handleCloseInfoBox}
                onChatClick={handleChatAboutNode}
              />
            )}
          </div>
        )}

        {viewMode === 'timeline' && <TimelineView data={data} />}

        {viewMode === 'plan' && <PlanView data={data} />}
      </motion.div>
    </div>
  );
}