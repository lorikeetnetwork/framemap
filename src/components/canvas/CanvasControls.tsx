import { ZoomIn, ZoomOut, Maximize, LayoutGrid, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import LayoutSelector from "./LayoutSelector";
import ThemeSelector from "./ThemeSelector";
import { RelationshipToolbar } from "./RelationshipToolbar";

interface CanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onReLayout: () => void;
  isCreatingRelationship?: boolean;
  onStartCreatingRelationship?: () => void;
  onCancelCreatingRelationship?: () => void;
  pendingRelationshipFromNode?: string | null;
}

const CanvasControls = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  onReLayout,
  isCreatingRelationship = false,
  onStartCreatingRelationship,
  onCancelCreatingRelationship,
  pendingRelationshipFromNode = null,
}: CanvasControlsProps) => {
  return (
    <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap">
      <Button variant="outline" size="sm" asChild className="gap-2">
        <Link to="/">
          <ArrowLeft className="w-4 h-4" />
          Tree View
        </Link>
      </Button>

      <div className="flex gap-1 bg-card border border-border rounded-none p-1">
        <LayoutSelector onLayoutChange={onReLayout} />
        <div className="w-px bg-border mx-1" />
        <ThemeSelector />
        <div className="w-px bg-border mx-1" />
        {onStartCreatingRelationship && onCancelCreatingRelationship && (
          <>
            <RelationshipToolbar
              isCreating={isCreatingRelationship}
              onStartCreating={onStartCreatingRelationship}
              onCancelCreating={onCancelCreatingRelationship}
              pendingFromNode={pendingRelationshipFromNode}
            />
            <div className="w-px bg-border mx-1" />
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onZoomOut}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <div className="flex items-center px-2 text-sm text-muted-foreground min-w-[4rem] justify-center">
          {Math.round(zoom * 100)}%
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onZoomIn}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <div className="w-px bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onResetView}
          title="Reset view"
        >
          <Maximize className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onReLayout}
          title="Auto-layout"
        >
          <LayoutGrid className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CanvasControls;
