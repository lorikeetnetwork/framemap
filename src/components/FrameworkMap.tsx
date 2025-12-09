import { useState, useCallback, useMemo, useEffect } from "react";
import { Network, Expand, Minimize2, RotateCcw, Save, AlertCircle, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TreeNode from "./TreeNode";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import SaveMapDialog from "./SaveMapDialog";
import LoadMapDialog from "./LoadMapDialog";
import { FrameworkNode } from "@/types/framework";
import { useAuth } from "@/hooks/useAuth";
import { useFrameworkMaps } from "@/hooks/useFrameworkMaps";
import { useFrameworkData } from "@/hooks/useFrameworkData";
import { toast } from "sonner";

const FrameworkMap = () => {
  const { user } = useAuth();
  const { maps, loading: mapsLoading, saveMap, updateMap, deleteMap } = useFrameworkMaps();
  
  const handleAutoSave = useCallback(async (data: FrameworkNode) => {
    if (frameworkState.currentMapId) {
      const success = await updateMap(frameworkState.currentMapId, { data });
      if (success) {
        toast.success("Auto-saved");
      }
    }
  }, []);

  const frameworkState = useFrameworkData({
    onAutoSave: user ? handleAutoSave : undefined,
    autoSaveDelay: 2000,
  });

  const {
    data: frameworkData,
    hasUnsavedChanges,
    currentMapId,
    updateNode,
    addChild,
    deleteNode,
    loadData,
    resetData,
  } = frameworkState;

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([frameworkData.name]));

  // Reset expanded nodes when framework data changes
  useEffect(() => {
    setExpandedNodes(new Set([frameworkData.name]));
  }, [frameworkData.name]);

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

  const reset = useCallback(() => {
    setSearchTerm("");
    resetData();
    setExpandedNodes(new Set(["Framework Map"]));
  }, [resetData]);

  const handleLoadMap = useCallback((data: FrameworkNode, mapId?: string) => {
    loadData(data, mapId);
    setSearchTerm("");
    setExpandedNodes(new Set([data.name]));
  }, [loadData]);

  const handleManualSave = useCallback(async () => {
    if (currentMapId) {
      const success = await updateMap(currentMapId, { data: frameworkData });
      if (success) {
        frameworkState.setHasUnsavedChanges(false);
        toast.success("Changes saved");
      }
    }
  }, [currentMapId, updateMap, frameworkData, frameworkState]);

  return (
    <div className="min-h-screen bg-background">
      {/* Scanline overlay effect */}
      <div className="fixed inset-0 scanline pointer-events-none z-50 opacity-30" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-tree-line">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Network className="w-8 h-8 text-primary animate-pulse-glow" />
                <div className="absolute inset-0 blur-md bg-primary/30 rounded-full" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-primary text-glow tracking-tight">
                Framework Map
              </h1>
              {/* Unsaved changes indicator */}
              {hasUnsavedChanges && user && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <AlertCircle className="w-3 h-3" />
                  <span>Unsaved</span>
                </div>
              )}
            </div>

            {/* Search and controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                resultCount={matchCount}
              />
              <div className="flex gap-2 flex-wrap justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={expandAll}
                  className="border-border hover:bg-accent hover:text-accent-foreground"
                >
                  <Expand className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Expand</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={collapseAll}
                  className="border-border hover:bg-accent hover:text-accent-foreground"
                >
                  <Minimize2 className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Collapse</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={reset}
                  className="border-border hover:bg-accent hover:text-accent-foreground"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                
                {/* Canvas View Link */}
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-border hover:bg-accent hover:text-accent-foreground"
                >
                  <Link to="/canvas">
                    <LayoutGrid className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Canvas</span>
                  </Link>
                </Button>
                
                {/* Save/Load buttons - only show when logged in */}
                {user && (
                  <>
                    {hasUnsavedChanges && currentMapId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleManualSave}
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                    )}
                    <SaveMapDialog data={frameworkData} onSave={saveMap} />
                    <LoadMapDialog 
                      maps={maps} 
                      loading={mapsLoading} 
                      onLoad={(data, map) => handleLoadMap(data, map?.id)}
                      onDelete={deleteMap}
                    />
                  </>
                )}
                
                <UserMenu />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-card/50 rounded-lg border border-tree-line p-6 backdrop-blur">
          {/* Stats bar */}
          <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-tree-line text-sm text-muted-foreground">
            <span>
              <span className="text-primary font-semibold">{expandedNodes.size}</span> nodes expanded
            </span>
            {searchTerm && (
              <span>
                <span className="text-primary font-semibold">{matchCount}</span> matches for "
                <span className="text-foreground">{searchTerm}</span>"
              </span>
            )}
            {user && (
              <span className="ml-auto text-xs">
                Double-click to edit • Right-click for options
              </span>
            )}
          </div>

          {/* Tree */}
          <div className="overflow-x-auto">
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
                onUpdateNode={user ? updateNode : undefined}
                onAddChild={user ? addChild : undefined}
                onDeleteNode={user ? deleteNode : undefined}
              />
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Click on folders to expand/collapse • Click on links to open in new tab
          </p>
          {user ? (
            <p className="mt-1">
              <span className="text-primary">Double-click</span> to edit • <span className="text-primary">Right-click</span> for more options
            </p>
          ) : (
            <p className="mt-1">
              <span className="text-primary">Sign in</span> to edit and save your custom framework maps
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default FrameworkMap;
