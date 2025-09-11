// In lib/layout.ts

import dagre from 'dagre';
import { Node as FlowNode, Edge as FlowEdge } from '@xyflow/react';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 180;
const nodeHeight = 40;

export function getLayoutedElements(nodes: FlowNode[], edges: FlowEdge[]): { nodes: FlowNode[]; edges: FlowEdge[] } {
  dagreGraph.setGraph({ rankdir: 'TB' }); // 'TB' for top-to-bottom layout

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    // We are shifting the Dagre node position (which is centered)
    // to the top-left corner to match React Flow's expectation.
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes: layoutedNodes, edges };
}