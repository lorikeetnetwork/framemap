import { useRef, useState, useCallback, useEffect } from "react";
import { useCanvasState } from "@/hooks/useCanvasState";
import CanvasNodeComponent from "./CanvasNode";
import CanvasConnections from "./CanvasConnections";
import CanvasControls from "./CanvasControls";
import { FrameworkNode, CanvasPositions } from "@/types/framework";

interface FrameworkCanvasProps {
  data: FrameworkNode;
  canvasPositions?: CanvasPositions | null;
  onNodeUpdate?: (nodePath: string, updates: Partial<FrameworkNode>) => void;
  onPositionsChange?: (positions: CanvasPositions) => void;
}

const FrameworkCanvas = ({ 
  data, 
  canvasPositions, 
  onNodeUpdate,
  onPositionsChange 
}: FrameworkCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const {
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
  } = useCanvasState(data, { 
    onNodeUpdate, 
    savedPositions: canvasPositions 
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Notify parent of position changes when dragging ends
  useEffect(() => {
    if (!isDragging && dragNodeId === null && onPositionsChange) {
      onPositionsChange(getPositions());
    }
  }, [isDragging, dragNodeId]);

  // Handle node drag start
  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    setIsDragging(true);
    setDragNodeId(nodeId);
    setDragOffset({
      x: e.clientX / zoom - node.x - pan.x,
      y: e.clientY / zoom - node.y - pan.y,
    });
  }, [nodes, zoom, pan]);

  // Handle canvas pan start
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || e.target === containerRef.current) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - pan.x * zoom, y: e.clientY - pan.y * zoom });
      setSelectedNode(null);
    }
  }, [pan, zoom, setSelectedNode]);

  // Handle mouse move for dragging/panning
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && dragNodeId) {
      const newX = e.clientX / zoom - dragOffset.x - pan.x;
      const newY = e.clientY / zoom - dragOffset.y - pan.y;
      updateNodePosition(dragNodeId, newX, newY);
    } else if (isPanning) {
      setPan({
        x: (e.clientX - dragStart.x) / zoom,
        y: (e.clientY - dragStart.y) / zoom,
      });
    }
  }, [isDragging, isPanning, dragNodeId, dragOffset, dragStart, zoom, pan, updateNodePosition, setPan]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsPanning(false);
    setDragNodeId(null);
  }, []);

  // Handle wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setZoom((prev) => Math.max(0.2, Math.min(2, prev + delta)));
  }, [setZoom]);

  // Handle node click
  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
  }, [selectedNode, setSelectedNode]);

  // Calculate canvas bounds for proper sizing
  const canvasBounds = nodes.reduce(
    (acc, node) => ({
      minX: Math.min(acc.minX, node.x),
      minY: Math.min(acc.minY, node.y),
      maxX: Math.max(acc.maxX, node.x + node.width),
      maxY: Math.max(acc.maxY, node.y + node.height),
    }),
    { minX: 0, minY: 0, maxX: 1000, maxY: 1000 }
  );

  const canvasWidth = canvasBounds.maxX + 200;
  const canvasHeight = canvasBounds.maxY + 200;

  return (
    <div className="h-full w-full bg-background overflow-hidden relative">
      <CanvasControls
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetView={resetView}
        onReLayout={reLayout}
      />

      <div
        ref={containerRef}
        className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          ref={canvasRef}
          className="relative"
          style={{
            width: canvasWidth,
            height: canvasHeight,
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: "0 0",
          }}
        >
          {/* Grid pattern background */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--border) / 0.3) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--border) / 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Connections */}
          <CanvasConnections nodes={nodes} connections={connections} />

          {/* Nodes */}
          {nodes.map((node) => (
            <CanvasNodeComponent
              key={node.id}
              node={node}
              isSelected={selectedNode === node.id}
              zoom={zoom}
              onMouseDown={handleNodeMouseDown}
              onClick={handleNodeClick}
            />
          ))}
        </div>
      </div>

      {/* Selected node info */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card border border-border p-4">
          <h3 className="font-medium text-sm mb-2">
            {nodes.find((n) => n.id === selectedNode)?.node.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {nodes.find((n) => n.id === selectedNode)?.node.description || "No description"}
          </p>
        </div>
      )}
    </div>
  );
};

export default FrameworkCanvas;
