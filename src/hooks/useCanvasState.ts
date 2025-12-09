import { useState, useCallback, useMemo } from "react";
import { FrameworkNode } from "@/types/framework";
import { CanvasNode, CanvasConnection } from "@/types/canvas";

// Convert hierarchical data to flat canvas nodes with positions
function flattenToCanvasNodes(
  node: FrameworkNode,
  parentId: string | undefined = undefined,
  startX: number = 100,
  startY: number = 100,
  level: number = 0,
  index: number = 0,
  siblingCount: number = 1
): { nodes: CanvasNode[]; connections: CanvasConnection[] } {
  const nodeId = parentId ? `${parentId}/${node.name}` : node.name;
  const horizontalSpacing = 320;
  const verticalSpacing = 140;
  
  const x = startX + level * horizontalSpacing;
  const y = startY + index * verticalSpacing;
  
  const canvasNode: CanvasNode = {
    id: nodeId,
    node,
    x,
    y,
    width: 240,
    height: 80,
    parentId,
  };

  const nodes: CanvasNode[] = [canvasNode];
  const connections: CanvasConnection[] = [];

  if (parentId) {
    connections.push({ from: parentId, to: nodeId });
  }

  if (node.children) {
    let childY = y;
    node.children.forEach((child, idx) => {
      const result = flattenToCanvasNodes(
        child,
        nodeId,
        startX,
        childY,
        level + 1,
        0,
        node.children!.length
      );
      nodes.push(...result.nodes);
      connections.push(...result.connections);
      childY += result.nodes.filter(n => n.id.startsWith(nodeId + "/")).length * verticalSpacing + verticalSpacing;
    });
  }

  return { nodes, connections };
}

// Auto-layout nodes in a tree structure
function autoLayout(frameworkData: FrameworkNode): { nodes: CanvasNode[]; connections: CanvasConnection[] } {
  const nodes: CanvasNode[] = [];
  const connections: CanvasConnection[] = [];
  
  function processNode(
    node: FrameworkNode,
    parentId: string | undefined,
    level: number,
    yOffset: { value: number }
  ): number {
    const nodeId = parentId ? `${parentId}/${node.name}` : node.name;
    const horizontalSpacing = 320;
    const verticalSpacing = 100;
    const nodeHeight = 80;
    
    const x = 100 + level * horizontalSpacing;
    let totalChildHeight = 0;
    const childYPositions: number[] = [];
    
    // First pass: calculate positions for all children
    if (node.children && node.children.length > 0) {
      const startY = yOffset.value;
      node.children.forEach((child) => {
        childYPositions.push(yOffset.value);
        const childHeight = processNode(child, nodeId, level + 1, yOffset);
        totalChildHeight += childHeight;
      });
      
      // Center this node among its children
      const firstChildY = childYPositions[0];
      const lastChildY = childYPositions[childYPositions.length - 1];
      const y = (firstChildY + lastChildY) / 2;
      
      nodes.push({
        id: nodeId,
        node,
        x,
        y,
        width: 240,
        height: nodeHeight,
        parentId,
      });
      
      if (parentId) {
        connections.push({ from: parentId, to: nodeId });
      }
      
      // Add connections to children
      node.children.forEach((child) => {
        const childId = `${nodeId}/${child.name}`;
        connections.push({ from: nodeId, to: childId });
      });
      
      return Math.max(totalChildHeight, nodeHeight + verticalSpacing);
    } else {
      // Leaf node
      const y = yOffset.value;
      nodes.push({
        id: nodeId,
        node,
        x,
        y,
        width: 240,
        height: nodeHeight,
        parentId,
      });
      
      if (parentId) {
        connections.push({ from: parentId, to: nodeId });
      }
      
      yOffset.value += nodeHeight + verticalSpacing;
      return nodeHeight + verticalSpacing;
    }
  }
  
  processNode(frameworkData, undefined, 0, { value: 100 });
  
  // Remove duplicate connections
  const uniqueConnections = connections.filter((conn, idx, arr) => 
    arr.findIndex(c => c.from === conn.from && c.to === conn.to) === idx
  );
  
  return { nodes, connections: uniqueConnections };
}

export function useCanvasState(frameworkData: FrameworkNode) {
  const initialLayout = useMemo(() => autoLayout(frameworkData), [frameworkData]);
  
  const [nodes, setNodes] = useState<CanvasNode[]>(initialLayout.nodes);
  const [connections] = useState<CanvasConnection[]>(initialLayout.connections);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const updateNodePosition = useCallback((nodeId: string, x: number, y: number) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, x, y } : n))
    );
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.1, 0.3));
  }, []);

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const reLayout = useCallback(() => {
    const newLayout = autoLayout(frameworkData);
    setNodes(newLayout.nodes);
  }, [frameworkData]);

  return {
    nodes,
    connections,
    zoom,
    pan,
    setPan,
    selectedNode,
    setSelectedNode,
    updateNodePosition,
    zoomIn,
    zoomOut,
    resetView,
    reLayout,
    setZoom,
  };
}
