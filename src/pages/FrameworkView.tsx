import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Network, 
  Expand, 
  Minimize2, 
  Save, 
  AlertCircle, 
  LayoutGrid,
  Loader2,
  Undo2,
  Redo2,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TreeNode from "@/components/TreeNode";
import SearchBar from "@/components/SearchBar";
import DashboardLayout from "@/components/DashboardLayout";
import NodeStylePanel from "@/components/NodeStylePanel";
import { FrameworkNode, NodeStyle } from "@/types/framework";
import { useAuth } from "@/hooks/useAuth";
import { useFrameworkMaps } from "@/hooks/useFrameworkMaps";
import { useFrameworkDataWithHistory } from "@/hooks/useFrameworkDataWithHistory";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const FrameworkView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { maps, loading: mapsLoading, updateMap } = useFrameworkMaps();
  const [initialLoading, setInitialLoading] = useState(true);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const treeContainerRef = useRef<HTMLDivElement>(null);
  
  // Find the current map
  const currentMap = useMemo(() => maps.find(m => m.id === id), [maps, id]);
  
  const handleAutoSave = useCallback(async (data: FrameworkNode) => {
    if (id) {
      const success = await updateMap(id, { data });
      if (success) {
        toast.success("Auto-saved");
      }
    }
  }, [id, updateMap]);

  const frameworkState = useFrameworkDataWithHistory({
    onAutoSave: user ? handleAutoSave : undefined,
    autoSaveDelay: 2000,
  });

  const {
    data: frameworkData,
    hasUnsavedChanges,
    updateNode,
    addChild,
    addSibling,
    deleteNode,
    loadData,
    selectedNodePath,
    selectedNode,
    setSelectedNodePath,
    undo,
    redo,
    canUndo,
    canRedo,
    findNodeByPath,
  } = frameworkState;

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([frameworkData.name]));
  const [editingNodePath, setEditingNodePath] = useState<string | null>(null);

  // Load map data when available
  useEffect(() => {
    if (!mapsLoading && currentMap) {
      loadData(currentMap.data, currentMap.id);
      setExpandedNodes(new Set([currentMap.data.name]));
      setInitialLoading(false);
    } else if (!mapsLoading && !currentMap && !authLoading && user) {
      toast.error("Framework not found");
      navigate("/frameworks");
    } else if (!mapsLoading && !authLoading) {
      setInitialLoading(false);
    }
  }, [mapsLoading, currentMap, authLoading, user, loadData, navigate]);

  // Find all paths that match the search
  const findMatchingPaths = useCallback(
    (node: FrameworkNode, path: string, term: string): string[] => {
      const matches: string[] = [];
      const currentPath = path ? `${path}/${node.name}` : node.name;

      if (node.name.toLowerCase().includes(term.toLowerCase())) {
        matches.push(currentPath);
      }

      if (node.children) {
        node.children.forEach((child) => {
          matches.push(...findMatchingPaths(child, currentPath, term));
        });
      }

      return matches;
    },
    []
  );

  // Get all ancestor paths for matched nodes
  const getAncestorPaths = useCallback((matchedPaths: string[]): Set<string> => {
    const ancestors = new Set<string>();
    matchedPaths.forEach((path) => {
      const parts = path.split("/");
      let currentPath = "";
      parts.forEach((part) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        ancestors.add(currentPath);
      });
    });
    return ancestors;
  }, []);

  // Memoized matched paths
  const { matchedPaths, pathsToExpand, matchCount } = useMemo(() => {
    if (!searchTerm) {
      return { matchedPaths: new Set<string>(), pathsToExpand: new Set<string>(), matchCount: 0 };
    }
    const matches = findMatchingPaths(frameworkData, "", searchTerm);
    return {
      matchedPaths: new Set(matches),
      pathsToExpand: getAncestorPaths(matches),
      matchCount: matches.length,
    };
  }, [searchTerm, findMatchingPaths, getAncestorPaths, frameworkData]);

  // Auto-expand matched paths when searching
  useEffect(() => {
    if (searchTerm && pathsToExpand.size > 0) {
      setExpandedNodes((prev) => new Set([...prev, ...pathsToExpand]));
    }
  }, [searchTerm, pathsToExpand]);

  const toggleNode = useCallback((nodePath: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodePath)) {
        next.delete(nodePath);
      } else {
        next.add(nodePath);
      }
      return next;
    });
  }, []);

  // Get all node paths as flat list for navigation
  const getAllNodePathsFlat = useCallback((node: FrameworkNode, path: string = ""): string[] => {
    const currentPath = path ? `${path}/${node.name}` : node.name;
    const paths = [currentPath];
    if (node.children && expandedNodes.has(currentPath)) {
      node.children.forEach((child) => {
        paths.push(...getAllNodePathsFlat(child, currentPath));
      });
    }
    return paths;
  }, [expandedNodes]);

  // Get all node paths for expand all
  const getAllNodePaths = useCallback((node: FrameworkNode, path: string = ""): string[] => {
    const currentPath = path ? `${path}/${node.name}` : node.name;
    const paths = [currentPath];
    if (node.children) {
      node.children.forEach((child) => {
        paths.push(...getAllNodePaths(child, currentPath));
      });
    }
    return paths;
  }, []);

  const expandAll = useCallback(() => {
    const allPaths = getAllNodePaths(frameworkData);
    setExpandedNodes(new Set(allPaths));
  }, [getAllNodePaths, frameworkData]);

  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set([frameworkData.name]));
  }, [frameworkData.name]);

  const handleManualSave = useCallback(async () => {
    if (id) {
      const success = await updateMap(id, { data: frameworkData });
      if (success) {
        frameworkState.setHasUnsavedChanges(false);
        toast.success("Changes saved");
      }
    }
  }, [id, updateMap, frameworkData, frameworkState]);

  // Navigate to sibling/child in tree
  const navigateTree = useCallback((direction: "up" | "down" | "left" | "right") => {
    if (!selectedNodePath) {
      setSelectedNodePath(frameworkData.name);
      return;
    }

    const visiblePaths = getAllNodePathsFlat(frameworkData);
    const currentIndex = visiblePaths.indexOf(selectedNodePath);

    if (direction === "up" && currentIndex > 0) {
      setSelectedNodePath(visiblePaths[currentIndex - 1]);
    } else if (direction === "down" && currentIndex < visiblePaths.length - 1) {
      setSelectedNodePath(visiblePaths[currentIndex + 1]);
    } else if (direction === "left") {
      // Collapse current node or go to parent
      if (expandedNodes.has(selectedNodePath)) {
        toggleNode(selectedNodePath);
      } else {
        const parentPath = selectedNodePath.split("/").slice(0, -1).join("/");
        if (parentPath) setSelectedNodePath(parentPath);
      }
    } else if (direction === "right") {
      // Expand current node or go to first child
      const result = findNodeByPath(selectedNodePath);
      if (result?.node.children?.length) {
        if (!expandedNodes.has(selectedNodePath)) {
          toggleNode(selectedNodePath);
        } else {
          setSelectedNodePath(`${selectedNodePath}/${result.node.children[0].name}`);
        }
      }
    }
  }, [selectedNodePath, frameworkData, getAllNodePathsFlat, expandedNodes, toggleNode, setSelectedNodePath, findNodeByPath]);

  // Handle style update for selected node
  const handleStyleUpdate = useCallback((style: Partial<NodeStyle>) => {
    if (selectedNodePath && selectedNode) {
      const newStyle = { ...(selectedNode.style || {}), ...style };
      // Remove undefined values
      Object.keys(newStyle).forEach(key => {
        if (newStyle[key as keyof NodeStyle] === undefined) {
          delete newStyle[key as keyof NodeStyle];
        }
      });
      updateNode(selectedNodePath, { style: Object.keys(newStyle).length > 0 ? newStyle : undefined });
    }
  }, [selectedNodePath, selectedNode, updateNode]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    enabled: !initialLoading && !editingNodePath,
    shortcuts: [
      {
        key: "z",
        ctrl: true,
        action: () => {
          if (canUndo) {
            undo();
            toast.info("Undo");
          }
        },
        description: "Undo",
      },
      {
        key: "y",
        ctrl: true,
        action: () => {
          if (canRedo) {
            redo();
            toast.info("Redo");
          }
        },
        description: "Redo",
      },
      {
        key: "z",
        ctrl: true,
        shift: true,
        action: () => {
          if (canRedo) {
            redo();
            toast.info("Redo");
          }
        },
        description: "Redo (alternate)",
      },
      {
        key: "s",
        ctrl: true,
        action: () => {
          if (hasUnsavedChanges) {
            handleManualSave();
          }
        },
        description: "Save",
      },
      {
        key: "Escape",
        action: () => {
          setSelectedNodePath(null);
          setSearchTerm("");
          setEditingNodePath(null);
        },
        description: "Clear selection",
      },
      {
        key: "Delete",
        action: () => {
          if (selectedNodePath && selectedNodePath !== frameworkData.name) {
            deleteNode(selectedNodePath);
            toast.info("Node deleted");
          }
        },
        description: "Delete selected node",
      },
      // Arrow key navigation
      {
        key: "ArrowUp",
        action: () => navigateTree("up"),
        description: "Navigate up",
      },
      {
        key: "ArrowDown",
        action: () => navigateTree("down"),
        description: "Navigate down",
      },
      {
        key: "ArrowLeft",
        action: () => navigateTree("left"),
        description: "Collapse or go to parent",
      },
      {
        key: "ArrowRight",
        action: () => navigateTree("right"),
        description: "Expand or go to first child",
      },
      // Add child with Tab
      {
        key: "Tab",
        action: () => {
          if (selectedNodePath) {
            const newNode: FrameworkNode = { name: "New Node", type: "folder" };
            addChild(selectedNodePath, newNode);
            if (!expandedNodes.has(selectedNodePath)) {
              toggleNode(selectedNodePath);
            }
            toast.info("Added child node");
          }
        },
        description: "Add child node",
      },
      // Add sibling with Shift+Tab
      {
        key: "Tab",
        shift: true,
        action: () => {
          if (selectedNodePath && selectedNodePath !== frameworkData.name) {
            const newNode: FrameworkNode = { name: "New Node", type: "folder" };
            addSibling(selectedNodePath, newNode);
            toast.info("Added sibling node");
          }
        },
        description: "Add sibling node",
      },
      // Edit with Enter
      {
        key: "Enter",
        action: () => {
          if (selectedNodePath) {
            setEditingNodePath(selectedNodePath);
          }
        },
        description: "Edit selected node",
      },
    ],
  });

  // Loading state
  if (initialLoading || authLoading || mapsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Network className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sign in Required</h2>
          <p className="text-muted-foreground mb-4">Please sign in to view your frameworks</p>
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout showDialogs={false}>
      <div className="h-full flex flex-col">
        {/* Toolbar */}
        <div className="flex-shrink-0 bg-background border-b border-border p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Title */}
            <div className="flex items-center gap-3">
              <Network className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  {currentMap?.name || 'Framework'}
                </h1>
                {currentMap?.description && (
                  <p className="text-xs text-muted-foreground truncate max-w-xs">
                    {currentMap.description}
                  </p>
                )}
              </div>
              {hasUnsavedChanges && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <AlertCircle className="w-3 h-3" />
                  <span>Unsaved</span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-2 items-center">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                resultCount={matchCount}
              />
              
              <TooltipProvider>
                {/* Undo/Redo */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={undo} 
                      disabled={!canUndo}
                    >
                      <Undo2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={redo} 
                      disabled={!canRedo}
                    >
                      <Redo2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={expandAll}>
                      <Expand className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Expand</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Expand all nodes</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={collapseAll}>
                      <Minimize2 className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Collapse</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Collapse all nodes</TooltipContent>
                </Tooltip>

                {/* Style Panel Toggle */}
                <Sheet open={showStylePanel} onOpenChange={setShowStylePanel}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SheetTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={!selectedNodePath}
                        >
                          <Palette className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Style</span>
                        </Button>
                      </SheetTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Style selected node</TooltipContent>
                  </Tooltip>
                  <SheetContent side="right" className="w-80 p-0">
                    {selectedNode && (
                      <NodeStylePanel
                        node={selectedNode}
                        onUpdateStyle={handleStyleUpdate}
                        onClose={() => setShowStylePanel(false)}
                      />
                    )}
                  </SheetContent>
                </Sheet>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/frameworks/${id}/canvas`}>
                        <LayoutGrid className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Canvas</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Open canvas view</TooltipContent>
                </Tooltip>

                {hasUnsavedChanges && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleManualSave}
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Save changes (Ctrl+S)</TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-card/50 rounded-lg border border-border p-6">
            {/* Stats bar */}
            <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-border text-sm text-muted-foreground">
              <span>
                <span className="text-primary font-semibold">{expandedNodes.size}</span> nodes expanded
              </span>
              {searchTerm && (
                <span>
                  <span className="text-primary font-semibold">{matchCount}</span> matches for "
                  <span className="text-foreground">{searchTerm}</span>"
                </span>
              )}
              <span className="ml-auto text-xs">
                ↑↓←→ navigate • Tab add child • Enter edit • Del delete
              </span>
            </div>

            {/* Tree */}
            <div className="overflow-x-auto" ref={treeContainerRef}>
              <div className="min-w-max">
                <TreeNode
                  node={frameworkData}
                  level={0}
                  searchTerm={searchTerm}
                  expandedNodes={expandedNodes}
                  toggleNode={toggleNode}
                  nodePath={frameworkData.name}
                  isLast={true}
                  matchedPaths={matchedPaths}
                  onUpdateNode={updateNode}
                  onAddChild={addChild}
                  onAddSibling={addSibling}
                  onDeleteNode={deleteNode}
                  selectedNodePath={selectedNodePath}
                  onSelectNode={setSelectedNodePath}
                  isEditing={editingNodePath === frameworkData.name}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FrameworkView;
