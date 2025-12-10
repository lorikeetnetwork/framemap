import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Network, Loader2, TreeDeciduous, Save, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import FrameworkCanvas from "@/components/canvas/FrameworkCanvas";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useFrameworkMaps } from "@/hooks/useFrameworkMaps";
import { useFrameworkDataWithHistory } from "@/hooks/useFrameworkDataWithHistory";
import { FrameworkNode, CanvasPositions } from "@/types/framework";
import { toast } from "sonner";

const FrameworkCanvasView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { maps, loading: mapsLoading, updateMap } = useFrameworkMaps();
  const [initialLoading, setInitialLoading] = useState(true);
  const [canvasPositions, setCanvasPositions] = useState<CanvasPositions | null>(null);
  
  // Find the current map
  const currentMap = useMemo(() => maps.find(m => m.id === id), [maps, id]);

  // Auto-save handler
  const handleAutoSave = useCallback(async (data: FrameworkNode) => {
    if (id) {
      const success = await updateMap(id, { data, canvas_positions: canvasPositions });
      if (success) {
        toast.success("Auto-saved");
      }
    }
  }, [id, updateMap, canvasPositions]);

  const frameworkState = useFrameworkDataWithHistory({
    onAutoSave: user ? handleAutoSave : undefined,
    autoSaveDelay: 2000,
  });

  const {
    data: frameworkData,
    hasUnsavedChanges,
    updateNode,
    loadData,
  } = frameworkState;

  // Handle loading and navigation
  useEffect(() => {
    if (!mapsLoading && !authLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!currentMap && !mapsLoading) {
        toast.error("Framework not found");
        navigate("/frameworks");
      } else if (currentMap) {
        loadData(currentMap.data, currentMap.id);
        setCanvasPositions(currentMap.canvas_positions as CanvasPositions | null);
        setInitialLoading(false);
      }
    }
  }, [mapsLoading, currentMap, authLoading, user, navigate, loadData]);

  // Handle node updates from canvas (bidirectional sync)
  const handleNodeUpdate = useCallback((nodePath: string, updates: Partial<FrameworkNode>) => {
    updateNode(nodePath, updates);
  }, [updateNode]);

  // Handle position changes
  const handlePositionsChange = useCallback((positions: CanvasPositions) => {
    setCanvasPositions(positions);
    frameworkState.setHasUnsavedChanges(true);
  }, [frameworkState]);

  // Manual save
  const handleManualSave = useCallback(async () => {
    if (id) {
      const success = await updateMap(id, { 
        data: frameworkData, 
        canvas_positions: canvasPositions 
      });
      if (success) {
        frameworkState.setHasUnsavedChanges(false);
        toast.success("Changes saved");
      }
    }
  }, [id, updateMap, frameworkData, canvasPositions, frameworkState]);

  // Loading state
  if (initialLoading || authLoading || mapsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentMap) {
    return null;
  }

  return (
    <DashboardLayout showDialogs={false}>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex-shrink-0 bg-background border-b border-border z-10 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Network className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  {currentMap.name}
                </h1>
                <p className="text-xs text-muted-foreground">Canvas View</p>
              </div>
              {hasUnsavedChanges && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <AlertCircle className="w-3 h-3" />
                  <span>Unsaved</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
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
              <Button variant="outline" size="sm" asChild>
                <Link to={`/frameworks/${id}`}>
                  <TreeDeciduous className="w-4 h-4 mr-1" />
                  Tree View
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-hidden">
          <FrameworkCanvas 
            data={frameworkData}
            canvasPositions={canvasPositions}
            onNodeUpdate={handleNodeUpdate}
            onPositionsChange={handlePositionsChange}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FrameworkCanvasView;
