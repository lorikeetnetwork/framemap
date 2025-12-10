import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { FrameworkNode } from "@/types/framework";
import { useUndoRedo } from "./useUndoRedo";
import defaultFrameworkData from "@/data/frameworkData.json";

interface UseFrameworkDataWithHistoryProps {
  onAutoSave?: (data: FrameworkNode) => void;
  autoSaveDelay?: number;
  maxHistory?: number;
}

export const useFrameworkDataWithHistory = ({
  onAutoSave,
  autoSaveDelay = 2000,
  maxHistory = 50,
}: UseFrameworkDataWithHistoryProps = {}) => {
  const {
    state: data,
    set: setData,
    undo,
    redo,
    reset: resetHistory,
    clear: clearHistory,
    canUndo,
    canRedo,
  } = useUndoRedo<FrameworkNode>(defaultFrameworkData as FrameworkNode, { maxHistory });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentMapId, setCurrentMapId] = useState<string | null>(null);
  const [selectedNodePath, setSelectedNodePath] = useState<string | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  // Trigger auto-save when data changes
  useEffect(() => {
    if (hasUnsavedChanges && currentMapId && onAutoSave) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      autoSaveTimerRef.current = setTimeout(() => {
        onAutoSave(data);
        setHasUnsavedChanges(false);
      }, autoSaveDelay);
    }
  }, [data, hasUnsavedChanges, currentMapId, onAutoSave, autoSaveDelay]);

  // Find node by path and return parent context
  const findNodeByPath = useCallback(
    (
      root: FrameworkNode,
      path: string
    ): { node: FrameworkNode; parent: FrameworkNode | null; index: number } | null => {
      const parts = path.split("/");

      if (parts.length === 1 && parts[0] === root.name) {
        return { node: root, parent: null, index: 0 };
      }

      const findRecursive = (
        current: FrameworkNode,
        remainingParts: string[],
        parent: FrameworkNode | null
      ): { node: FrameworkNode; parent: FrameworkNode | null; index: number } | null => {
        if (remainingParts.length === 0) {
          const index = parent?.children?.findIndex((c) => c.name === current.name) ?? 0;
          return { node: current, parent, index };
        }

        if (!current.children) return null;

        const nextName = remainingParts[0];
        const childIndex = current.children.findIndex((c) => c.name === nextName);
        if (childIndex === -1) return null;

        return findRecursive(current.children[childIndex], remainingParts.slice(1), current);
      };

      return findRecursive(root, parts.slice(1), null);
    },
    []
  );

  // Deep clone helper
  const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

  // Update a node at a specific path
  const updateNode = useCallback((nodePath: string, updates: Partial<FrameworkNode>) => {
    setData((prevData) => {
      const newData = deepClone(prevData);
      const result = findNodeByPath(newData, nodePath);
      if (!result) return prevData;

      Object.assign(result.node, updates);
      return newData;
    });
    setHasUnsavedChanges(true);
  }, [findNodeByPath, setData]);

  // Add a child node
  const addChild = useCallback((parentPath: string, newNode: FrameworkNode) => {
    setData((prevData) => {
      const newData = deepClone(prevData);
      const result = findNodeByPath(newData, parentPath);
      if (!result) return prevData;

      if (!result.node.children) {
        result.node.children = [];
      }
      result.node.children.push(newNode);
      return newData;
    });
    setHasUnsavedChanges(true);
  }, [findNodeByPath, setData]);

  // Add a sibling node
  const addSibling = useCallback((nodePath: string, newNode: FrameworkNode) => {
    setData((prevData) => {
      const newData = deepClone(prevData);
      const result = findNodeByPath(newData, nodePath);
      if (!result || !result.parent) return prevData;

      const insertIndex = result.index + 1;
      result.parent.children?.splice(insertIndex, 0, newNode);
      return newData;
    });
    setHasUnsavedChanges(true);
  }, [findNodeByPath, setData]);

  // Delete a node
  const deleteNode = useCallback((nodePath: string) => {
    setData((prevData) => {
      const newData = deepClone(prevData);
      const result = findNodeByPath(newData, nodePath);
      if (!result || !result.parent) return prevData; // Can't delete root

      result.parent.children = result.parent.children?.filter((c) => c.name !== result.node.name);
      return newData;
    });
    setHasUnsavedChanges(true);
    // Clear selection if deleted node was selected
    if (selectedNodePath === nodePath) {
      setSelectedNodePath(null);
    }
  }, [findNodeByPath, setData, selectedNodePath]);

  // Move a node
  const moveNode = useCallback(
    (sourcePath: string, targetPath: string, position: "before" | "after" | "inside") => {
      setData((prevData) => {
        const newData = deepClone(prevData);
        const sourceResult = findNodeByPath(newData, sourcePath);
        const targetResult = findNodeByPath(newData, targetPath);

        if (!sourceResult || !targetResult || !sourceResult.parent) return prevData;

        // Remove from source
        sourceResult.parent.children = sourceResult.parent.children?.filter(
          (c) => c.name !== sourceResult.node.name
        );

        // Add to target
        if (position === "inside") {
          if (!targetResult.node.children) {
            targetResult.node.children = [];
          }
          targetResult.node.children.push(sourceResult.node);
        } else if (targetResult.parent) {
          const insertIndex = position === "before" ? targetResult.index : targetResult.index + 1;
          targetResult.parent.children?.splice(insertIndex, 0, sourceResult.node);
        }

        return newData;
      });
      setHasUnsavedChanges(true);
    },
    [findNodeByPath, setData]
  );

  // Handle undo with unsaved changes tracking
  const handleUndo = useCallback(() => {
    undo();
    setHasUnsavedChanges(true);
  }, [undo]);

  // Handle redo with unsaved changes tracking
  const handleRedo = useCallback(() => {
    redo();
    setHasUnsavedChanges(true);
  }, [redo]);

  // Load data from a saved map
  const loadData = useCallback((newData: FrameworkNode, mapId?: string) => {
    resetHistory(newData);
    setCurrentMapId(mapId || null);
    setHasUnsavedChanges(false);
    setSelectedNodePath(null);
  }, [resetHistory]);

  // Reset to default
  const resetData = useCallback(() => {
    resetHistory(defaultFrameworkData as FrameworkNode);
    setCurrentMapId(null);
    setHasUnsavedChanges(false);
    setSelectedNodePath(null);
  }, [resetHistory]);

  // Get the selected node
  const selectedNode = useMemo(() => {
    if (!selectedNodePath) return null;
    return findNodeByPath(data, selectedNodePath)?.node || null;
  }, [data, selectedNodePath, findNodeByPath]);

  return {
    data,
    hasUnsavedChanges,
    currentMapId,
    selectedNodePath,
    selectedNode,
    setSelectedNodePath,
    updateNode,
    addChild,
    addSibling,
    deleteNode,
    moveNode,
    loadData,
    resetData,
    setHasUnsavedChanges,
    findNodeByPath: (path: string) => findNodeByPath(data, path),
    // Undo/Redo
    undo: handleUndo,
    redo: handleRedo,
    canUndo,
    canRedo,
    clearHistory,
  };
};
