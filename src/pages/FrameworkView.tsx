import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Network, 
  Expand, 
  Minimize2, 
  Save, 
  AlertCircle, 
  LayoutGrid,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TreeNode from "@/components/TreeNode";
import SearchBar from "@/components/SearchBar";
import DashboardLayout from "@/components/DashboardLayout";
import { FrameworkNode } from "@/types/framework";
import { useAuth } from "@/hooks/useAuth";
import { useFrameworkMaps } from "@/hooks/useFrameworkMaps";
import { useFrameworkData } from "@/hooks/useFrameworkData";
import { toast } from "sonner";

const FrameworkView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { maps, loading: mapsLoading, updateMap } = useFrameworkMaps();
  const [initialLoading, setInitialLoading] = useState(true);
  
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

  const frameworkState = useFrameworkData({
    onAutoSave: user ? handleAutoSave : undefined,
    autoSaveDelay: 2000,
  });

  const {
    data: frameworkData,
    hasUnsavedChanges,
    updateNode,
    addChild,
    deleteNode,
    loadData,
  } = frameworkState;

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([frameworkData.name]));

  // Load map data when available
  useEffect(() => {
    if (!mapsLoading && currentMap) {
      loadData(currentMap.data, currentMap.id);
      setExpandedNodes(new Set([currentMap.data.name]));
      setInitialLoading(false);
    } else if (!mapsLoading && !currentMap && !authLoading && user) {
      // Map not found
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
              <Button variant="outline" size="sm" onClick={expandAll}>
                <Expand className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Expand</span>
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll}>
                <Minimize2 className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Collapse</span>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/frameworks/${id}/canvas`}>
                  <LayoutGrid className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Canvas</span>
                </Link>
              </Button>
              {hasUnsavedChanges && (
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
                Double-click to edit • Right-click for options
              </span>
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
                  onUpdateNode={updateNode}
                  onAddChild={addChild}
                  onDeleteNode={deleteNode}
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
