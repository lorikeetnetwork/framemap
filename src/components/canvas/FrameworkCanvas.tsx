import { useRef, useState, useCallback, useEffect } from "react";
import { useCanvasState } from "@/hooks/useCanvasState";
import CanvasNodeComponent from "./CanvasNode";
import CanvasConnections from "./CanvasConnections";
import CanvasControls from "./CanvasControls";
import RelationshipLines from "./RelationshipLines";
import { CreateRelationshipDialog, EditRelationshipDialog } from "./RelationshipToolbar";
import { CanvasThemeProvider, useCanvasTheme } from "@/contexts/CanvasThemeContext";
import { FrameworkNode, CanvasPositions } from "@/types/framework";
import { Relationship } from "@/types/canvas";

interface FrameworkCanvasProps {
  data: FrameworkNode;
  canvasPositions?: CanvasPositions | null;
  onNodeUpdate?: (nodePath: string, updates: Partial<FrameworkNode>) => void;
  onPositionsChange?: (positions: CanvasPositions) => void;
  initialSettings?: {
    themeId?: string;
    layoutType?: "tree" | "org-chart" | "mind-map" | "radial";
    coloredBranches?: boolean;
    relationships?: Relationship[];
  };
  onSettingsChange?: (settings: {
    themeId: string;
    layoutType: string;
    coloredBranches: boolean;
    relationships: Relationship[];
  }) => void;
}

const FrameworkCanvasInner = ({
  data,
  canvasPositions,
  onNodeUpdate,
  onPositionsChange,
  onSettingsChange,
}: Omit<FrameworkCanvasProps, "initialSettings">) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { theme, layoutType } = useCanvasTheme();

  const {
    nodes,
    connections,
    relationships,
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
    getPositions,
    addRelationship,
    updateRelationship,
    deleteRelationship,
  } = useCanvasState(data, {
    onNodeUpdate,
    savedPositions: canvasPositions,
    layoutType,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Relationship creation state
  const [isCreatingRelationship, setIsCreatingRelationship] = useState(false);
  const [pendingFromNode, setPendingFromNode] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [pendingToNode, setPendingToNode] = useState<string | null>(null);

  // Relationship editing state
  const [editingRelationship, setEditingRelationship] = useState<Relationship | null>(null);

  useEffect(() => {
    if (!isDragging && dragNodeId === null && onPositionsChange) {
      onPositionsChange(getPositions());
    }
  }, [isDragging, dragNodeId, onPositionsChange, getPositions]);

  // Sync relationships to settings
  useEffect(() => {
    if (onSettingsChange) {
      onSettingsChange({
        themeId: theme.id,
        layoutType,
        coloredBranches: false,
        relationships,
      });
    }
  }, [relationships]);

  const handleNodeMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      if (isCreatingRelationship) {
        e.stopPropagation();
        return;
      }
      e.stopPropagation();
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      setIsDragging(true);
      setDragNodeId(nodeId);
      setDragOffset({
        x: e.clientX / zoom - node.x - pan.x,
        y: e.clientY / zoom - node.y - pan.y,
      });
    },
    [nodes, zoom, pan, isCreatingRelationship]
  );

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current || e.target === containerRef.current) {
        setIsPanning(true);
        setDragStart({ x: e.clientX - pan.x * zoom, y: e.clientY - pan.y * zoom });
        setSelectedNode(null);
      }
    },
    [pan, zoom, setSelectedNode]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
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
    },
    [isDragging, isPanning, dragNodeId, dragOffset, dragStart, zoom, pan, updateNodePosition, setPan]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsPanning(false);
    setDragNodeId(null);
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setZoom((prev) => Math.max(0.2, Math.min(2, prev + delta)));
    },
    [setZoom]
  );

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      if (isCreatingRelationship) {
        if (!pendingFromNode) {
          setPendingFromNode(nodeId);
        } else if (pendingFromNode !== nodeId) {
          setPendingToNode(nodeId);
          setShowCreateDialog(true);
        }
        return;
      }
      setSelectedNode(nodeId === selectedNode ? null : nodeId);
    },
    [selectedNode, setSelectedNode, isCreatingRelationship, pendingFromNode]
  );

  const handleCreateRelationship = (options: { label?: string; lineStyle: "solid" | "dashed" | "dotted"; arrowType: "none" | "start" | "end" | "both" }) => {
    if (pendingFromNode && pendingToNode) {
      addRelationship(pendingFromNode, pendingToNode, options);
    }
    setPendingFromNode(null);
    setPendingToNode(null);
    setIsCreatingRelationship(false);
  };

  const canvasBounds = nodes.reduce(
    (acc, node) => ({
      minX: Math.min(acc.minX, node.x),
      minY: Math.min(acc.minY, node.y),
      maxX: Math.max(acc.maxX, node.x + node.width),
      maxY: Math.max(acc.maxY, node.y + node.height),
    }),
    { minX: 0, minY: 0, maxX: 1000, maxY: 1000 }
  );

  const canvasWidth = canvasBounds.maxX + 400;
  const canvasHeight = canvasBounds.maxY + 400;

  return (
    <div className="h-full w-full overflow-hidden relative" style={{ backgroundColor: theme.colors.background }}>
      <CanvasControls
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetView={resetView}
        onReLayout={reLayout}
        isCreatingRelationship={isCreatingRelationship}
        onStartCreatingRelationship={() => setIsCreatingRelationship(true)}
        onCancelCreatingRelationship={() => {
          setIsCreatingRelationship(false);
          setPendingFromNode(null);
        }}
        pendingRelationshipFromNode={pendingFromNode}
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
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(${theme.colors.nodeBorder}33 1px, transparent 1px), linear-gradient(90deg, ${theme.colors.nodeBorder}33 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          <CanvasConnections nodes={nodes} connections={connections} />
          <RelationshipLines
            nodes={nodes}
            relationships={relationships}
            onRelationshipClick={(id) => setEditingRelationship(relationships.find((r) => r.id === id) || null)}
          />

          {nodes.map((node) => (
            <CanvasNodeComponent
              key={node.id}
              node={node}
              isSelected={selectedNode === node.id}
              zoom={zoom}
              onMouseDown={handleNodeMouseDown}
              onClick={handleNodeClick}
              isRelationshipMode={isCreatingRelationship}
              isPendingRelationship={pendingFromNode === node.id}
            />
          ))}
        </div>
      </div>

      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card border border-border p-4">
          <h3 className="font-medium text-sm mb-2">{nodes.find((n) => n.id === selectedNode)?.node.name}</h3>
          <p className="text-xs text-muted-foreground">{nodes.find((n) => n.id === selectedNode)?.node.description || "No description"}</p>
        </div>
      )}

      <CreateRelationshipDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onCreate={handleCreateRelationship} />

      <EditRelationshipDialog
        relationship={editingRelationship}
        open={!!editingRelationship}
        onOpenChange={(open) => !open && setEditingRelationship(null)}
        onSave={(updates) => editingRelationship && updateRelationship(editingRelationship.id, updates)}
        onDelete={() => {
          if (editingRelationship) deleteRelationship(editingRelationship.id);
          setEditingRelationship(null);
        }}
      />
    </div>
  );
};

const FrameworkCanvas = ({ initialSettings, ...props }: FrameworkCanvasProps) => {
  return (
    <CanvasThemeProvider
      initialThemeId={initialSettings?.themeId}
      initialLayoutType={initialSettings?.layoutType}
      initialColoredBranches={initialSettings?.coloredBranches}
    >
      <FrameworkCanvasInner {...props} />
    </CanvasThemeProvider>
  );
};

export default FrameworkCanvas;
