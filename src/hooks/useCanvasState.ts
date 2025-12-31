import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { FrameworkNode } from "@/types/framework";
import { CanvasNode, CanvasConnection, Relationship } from "@/types/canvas";
import { applyLayout, LayoutType } from "@/lib/canvasLayouts";

interface UseCanvasStateOptions {
  onNodeUpdate?: (nodePath: string, updates: Partial<FrameworkNode>) => void;
  savedPositions?: Record<string, { x: number; y: number }> | null;
  layoutType?: LayoutType;
  initialRelationships?: Relationship[];
}

export function useCanvasState(
  frameworkData: FrameworkNode,
  options: UseCanvasStateOptions = {}
) {
  const { onNodeUpdate, savedPositions, layoutType = "tree", initialRelationships = [] } = options;

  const initialLayout = useMemo(() => {
    const layout = applyLayout(frameworkData, layoutType);
    // Apply saved positions if available
    if (savedPositions) {
      layout.nodes = layout.nodes.map((node) => {
        const saved = savedPositions[node.id];
        if (saved) {
          return { ...node, x: saved.x, y: saved.y };
        }
        return node;
      });
    }
    return layout;
  }, [frameworkData, savedPositions, layoutType]);

  const [nodes, setNodes] = useState<CanvasNode[]>(initialLayout.nodes);
  const [connections, setConnections] = useState<CanvasConnection[]>(
    initialLayout.connections
  );
  const [relationships, setRelationships] = useState<Relationship[]>(initialRelationships);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Track previous framework data to prevent unnecessary updates
  const prevFrameworkDataRef = useRef<string | null>(null);
  const prevLayoutTypeRef = useRef<LayoutType>(layoutType);

  // Sync nodes when framework data or layout changes
  useEffect(() => {
    const currentDataString = JSON.stringify(frameworkData);
    const layoutChanged = prevLayoutTypeRef.current !== layoutType;

    // Skip if data hasn't actually changed and layout is the same
    if (prevFrameworkDataRef.current === currentDataString && !layoutChanged) {
      return;
    }
    prevFrameworkDataRef.current = currentDataString;
    prevLayoutTypeRef.current = layoutType;

    const newLayout = applyLayout(frameworkData, layoutType);

    // If layout changed, use fresh positions
    if (layoutChanged) {
      setNodes(newLayout.nodes);
      setConnections(newLayout.connections);
      return;
    }

    // Preserve positions for existing nodes
    setNodes((prevNodes) => {
      return newLayout.nodes.map((newNode) => {
        const existingNode = prevNodes.find((n) => n.id === newNode.id);
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
  }, [frameworkData, savedPositions, layoutType]);

  const updateNodePosition = useCallback(
    (nodeId: string, x: number, y: number) => {
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, x, y } : n))
      );
    },
    []
  );

  // Update node data (bidirectional sync to tree)
  const updateNodeData = useCallback(
    (nodeId: string, updates: Partial<FrameworkNode>) => {
      if (onNodeUpdate) {
        onNodeUpdate(nodeId, updates);
      }
      // Local update for immediate feedback
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId ? { ...n, node: { ...n.node, ...updates } } : n
        )
      );
    },
    [onNodeUpdate]
  );

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
    const newLayout = applyLayout(frameworkData, layoutType);
    setNodes(newLayout.nodes);
    setConnections(newLayout.connections);
  }, [frameworkData, layoutType]);

  // Get current positions for saving
  const getPositions = useCallback(() => {
    return nodes.reduce((acc, node) => {
      acc[node.id] = { x: node.x, y: node.y };
      return acc;
    }, {} as Record<string, { x: number; y: number }>);
  }, [nodes]);

  // Relationship management
  const addRelationship = useCallback(
    (
      fromNodeId: string,
      toNodeId: string,
      options: {
        label?: string;
        lineStyle?: Relationship["lineStyle"];
        arrowType?: Relationship["arrowType"];
        lineColor?: string;
      } = {}
    ) => {
      const newRel: Relationship = {
        id: `rel-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        fromNodeId,
        toNodeId,
        label: options.label,
        lineStyle: options.lineStyle || "dashed",
        arrowType: options.arrowType || "end",
        lineColor: options.lineColor,
      };
      setRelationships((prev) => [...prev, newRel]);
      return newRel;
    },
    []
  );

  const updateRelationship = useCallback(
    (id: string, updates: Partial<Relationship>) => {
      setRelationships((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
      );
    },
    []
  );

  const deleteRelationship = useCallback((id: string) => {
    setRelationships((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return {
    nodes,
    connections,
    relationships,
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
    addRelationship,
    updateRelationship,
    deleteRelationship,
    getRelationships: () => relationships,
  };
}
