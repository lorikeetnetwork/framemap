import { useState, useCallback, useMemo, useEffect } from "react";
import { Network, Expand, Minimize2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import TreeNode from "./TreeNode";
import SearchBar from "./SearchBar";
import frameworkData from "@/data/frameworkData.json";
import { FrameworkNode } from "@/types/framework";

const FrameworkMap = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([frameworkData.name]));

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
    const matches = findMatchingPaths(frameworkData as FrameworkNode, "", searchTerm);
    return {
      matchedPaths: new Set(matches),
      pathsToExpand: getAncestorPaths(matches),
      matchCount: matches.length,
    };
  }, [searchTerm, findMatchingPaths, getAncestorPaths]);

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
    const allPaths = getAllNodePaths(frameworkData as FrameworkNode);
    setExpandedNodes(new Set(allPaths));
  }, [getAllNodePaths]);

  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set([frameworkData.name]));
  }, []);

  const reset = useCallback(() => {
    setSearchTerm("");
    setExpandedNodes(new Set([frameworkData.name]));
  }, []);

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
            </div>

            {/* Search and controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                resultCount={matchCount}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={expandAll}
                  className="border-tree-line hover:bg-tree-node-hover hover:text-primary"
                >
                  <Expand className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Expand</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={collapseAll}
                  className="border-tree-line hover:bg-tree-node-hover hover:text-primary"
                >
                  <Minimize2 className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Collapse</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={reset}
                  className="border-tree-line hover:bg-tree-node-hover hover:text-primary"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
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
          </div>

          {/* Tree */}
          <div className="overflow-x-auto">
            <div className="min-w-max">
              <TreeNode
                node={frameworkData as FrameworkNode}
                level={0}
                searchTerm={searchTerm}
                expandedNodes={expandedNodes}
                toggleNode={toggleNode}
                nodePath={frameworkData.name}
                isLast={true}
                matchedPaths={matchedPaths}
              />
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Click on folders to expand/collapse • Click on links to open in new tab
          </p>
          <p className="mt-1">
            Edit <code className="text-primary bg-secondary px-1 rounded">src/data/frameworkData.json</code> to customize
          </p>
        </div>
      </main>
    </div>
  );
};

export default FrameworkMap;
