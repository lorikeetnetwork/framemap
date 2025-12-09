import { useState, useCallback, useRef, useEffect } from "react";
import { FrameworkNode } from "@/types/framework";
import defaultFrameworkData from "@/data/frameworkData.json";

interface UseFrameworkDataProps {
  onAutoSave?: (data: FrameworkNode) => void;
  autoSaveDelay?: number;
}

export const useFrameworkData = ({
  onAutoSave,
  autoSaveDelay = 2000,
}: UseFrameworkDataProps = {}) => {
  const [data, setData] = useState<FrameworkNode>(defaultFrameworkData as FrameworkNode);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentMapId, setCurrentMapId] = useState<string | null>(null);
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
      setHasUnsavedChanges(true);
      return newData;
    });
  }, [findNodeByPath]);

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
      setHasUnsavedChanges(true);
      return newData;
    });
  }, [findNodeByPath]);

  // Add a sibling node
  const addSibling = useCallback((nodePath: string, newNode: FrameworkNode) => {
    setData((prevData) => {
      const newData = deepClone(prevData);
      const result = findNodeByPath(newData, nodePath);
      if (!result || !result.parent) return prevData;

      const insertIndex = result.index + 1;
      result.parent.children?.splice(insertIndex, 0, newNode);
      setHasUnsavedChanges(true);
      return newData;
    });
  }, [findNodeByPath]);

  // Delete a node
  const deleteNode = useCallback((nodePath: string) => {
    setData((prevData) => {
      const newData = deepClone(prevData);
      const result = findNodeByPath(newData, nodePath);
      if (!result || !result.parent) return prevData; // Can't delete root

      result.parent.children = result.parent.children?.filter((c) => c.name !== result.node.name);
      setHasUnsavedChanges(true);
      return newData;
    });
  }, [findNodeByPath]);

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

        setHasUnsavedChanges(true);
        return newData;
      });
    },
    [findNodeByPath]
  );

  // Load data from a saved map
  const loadData = useCallback((newData: FrameworkNode, mapId?: string) => {
    setData(newData);
    setCurrentMapId(mapId || null);
    setHasUnsavedChanges(false);
  }, []);

  // Reset to default
  const resetData = useCallback(() => {
    setData(defaultFrameworkData as FrameworkNode);
    setCurrentMapId(null);
    setHasUnsavedChanges(false);
  }, []);

  return {
    data,
    hasUnsavedChanges,
    currentMapId,
    updateNode,
    addChild,
    addSibling,
    deleteNode,
    moveNode,
    loadData,
    resetData,
    setHasUnsavedChanges,
  };
};
