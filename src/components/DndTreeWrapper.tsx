import { useState, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FrameworkNode } from "@/types/framework";
import { cn } from "@/lib/utils";

interface DndTreeWrapperProps {
  children: React.ReactNode;
  frameworkData: FrameworkNode;
  expandedNodes: Set<string>;
  onMoveNode: (sourcePath: string, targetPath: string, position: "before" | "after" | "inside") => void;
}

// Collect all visible node paths for sortable context
const collectVisiblePaths = (
  node: FrameworkNode,
  parentPath: string,
  expandedNodes: Set<string>
): string[] => {
  const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
  const paths = [currentPath];

  if (node.children && expandedNodes.has(currentPath)) {
    node.children.forEach((child) => {
      paths.push(...collectVisiblePaths(child, currentPath, expandedNodes));
    });
  }

  return paths;
};

const DndTreeWrapper = ({ 
  children, 
  frameworkData, 
  expandedNodes,
  onMoveNode 
}: DndTreeWrapperProps) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px drag before activating
      },
    })
  );

  const visiblePaths = collectVisiblePaths(frameworkData, "", expandedNodes);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    setOverId(event.over?.id || null);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) return;

    const sourcePath = active.id as string;
    const targetPath = over.id as string;

    // Don't allow moving root node
    if (!sourcePath.includes("/")) return;

    // Don't allow moving to own descendants
    if (targetPath.startsWith(sourcePath + "/")) return;

    // Determine position based on Y coordinate
    // For simplicity, we'll default to "after" for now
    // A more sophisticated approach would check the mouse position relative to the drop target
    const position: "before" | "after" | "inside" = "after";

    onMoveNode(sourcePath, targetPath, position);
  }, [onMoveNode]);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setOverId(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={visiblePaths} strategy={verticalListSortingStrategy}>
        <div className={cn(activeId && "cursor-grabbing")}>
          {children}
        </div>
      </SortableContext>
      
      <DragOverlay>
        {activeId && (
          <div className="bg-card border border-primary rounded px-3 py-2 shadow-lg opacity-90">
            <span className="text-sm font-medium">
              {(activeId as string).split("/").pop()}
            </span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default DndTreeWrapper;
