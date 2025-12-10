import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Network, ArrowLeft, Loader2, TreeDeciduous } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/UserMenu";
import FrameworkCanvas from "@/components/canvas/FrameworkCanvas";
import { useAuth } from "@/hooks/useAuth";
import { useFrameworkMaps } from "@/hooks/useFrameworkMaps";
import { toast } from "sonner";

const FrameworkCanvasView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { maps, loading: mapsLoading } = useFrameworkMaps();
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Find the current map
  const currentMap = useMemo(() => maps.find(m => m.id === id), [maps, id]);

  // Handle loading and navigation
  useEffect(() => {
    if (!mapsLoading && !authLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!currentMap && !mapsLoading) {
        toast.error("Framework not found");
        navigate("/frameworks");
      } else {
        setInitialLoading(false);
      }
    }
  }, [mapsLoading, currentMap, authLoading, user, navigate]);

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
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-background/95 backdrop-blur border-b border-border z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/frameworks">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
              <Network className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  {currentMap.name}
                </h1>
                <p className="text-xs text-muted-foreground">Canvas View</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <Link to={`/frameworks/${id}`}>
                  <TreeDeciduous className="w-4 h-4 mr-1" />
                  Tree View
                </Link>
              </Button>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <FrameworkCanvas data={currentMap.data} />
      </div>
    </div>
  );
};

export default FrameworkCanvasView;
