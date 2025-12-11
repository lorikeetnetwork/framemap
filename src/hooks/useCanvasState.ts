import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { FrameworkNode } from "@/types/framework";
import { CanvasNode, CanvasConnection } from "@/types/canvas";

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

interface UseCanvasStateOptions {
  onNodeUpdate?: (nodePath: string, updates: Partial<FrameworkNode>) => void;
  savedPositions?: Record<string, { x: number; y: number }> | null;
}

export function useCanvasState(
  frameworkData: FrameworkNode, 
  options: UseCanvasStateOptions = {}
) {
  const { onNodeUpdate, savedPositions } = options;
  
  const initialLayout = useMemo(() => {
    const layout = autoLayout(frameworkData);
    // Apply saved positions if available
    if (savedPositions) {
      layout.nodes = layout.nodes.map(node => {
        const saved = savedPositions[node.id];
        if (saved) {
          return { ...node, x: saved.x, y: saved.y };
        }
        return node;
      });
    }
    return layout;
  }, [frameworkData, savedPositions]);
  
  const [nodes, setNodes] = useState<CanvasNode[]>(initialLayout.nodes);
  const [connections, setConnections] = useState<CanvasConnection[]>(initialLayout.connections);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  // Track previous framework data to prevent unnecessary updates
  const prevFrameworkDataRef = useRef<string | null>(null);

  // Sync nodes when framework data changes (bidirectional sync)
  useEffect(() => {
    const currentDataString = JSON.stringify(frameworkData);
    
    // Skip if data hasn't actually changed
    if (prevFrameworkDataRef.current === currentDataString) {
      return;
    }
    prevFrameworkDataRef.current = currentDataString;
    
    const newLayout = autoLayout(frameworkData);
    
    // Preserve positions for existing nodes using functional update
    setNodes(prevNodes => {
      return newLayout.nodes.map(newNode => {
        const existingNode = prevNodes.find(n => n.id === newNode.id);
        if (existingNode) {
          return { ...newNode, x: existingNode.x, y: existingNode.y };
        }
        // Check saved positions for new nodes
        const saved = savedPositions?.[newNode.id];
        if (saved) {
          return { ...newNode, x: saved.x, y: saved.y };
        }
        return newNode;
      });
    });
    setConnections(newLayout.connections);
  }, [frameworkData, savedPositions]);

  const updateNodePosition = useCallback((nodeId: string, x: number, y: number) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, x, y } : n))
    );
  }, []);

  // Update node data (bidirectional sync to tree)
  const updateNodeData = useCallback((nodeId: string, updates: Partial<FrameworkNode>) => {
    if (onNodeUpdate) {
      onNodeUpdate(nodeId, updates);
    }
    // Local update for immediate feedback
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, node: { ...n.node, ...updates } } : n))
    );
  }, [onNodeUpdate]);

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
    setConnections(newLayout.connections);
  }, [frameworkData]);

  // Get current positions for saving
  const getPositions = useCallback(() => {
    return nodes.reduce((acc, node) => {
      acc[node.id] = { x: node.x, y: node.y };
      return acc;
    }, {} as Record<string, { x: number; y: number }>);
  }, [nodes]);

  return {
    nodes,
    connections,
    zoom,
    pan,
    setPan,
    selectedNode,
    setSelectedNode,
    updateNodePosition,
    updateNodeData,
    zoomIn,
    zoomOut,
    resetView,
    reLayout,
    setZoom,
    getPositions,
  };
}
