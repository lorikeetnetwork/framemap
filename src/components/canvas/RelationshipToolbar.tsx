import { useState } from "react";
import { Link2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineStyle, ArrowType, Relationship } from "@/types/canvas";
import { cn } from "@/lib/utils";

interface RelationshipToolbarProps {
  isCreating: boolean;
  onStartCreating: () => void;
  onCancelCreating: () => void;
  pendingFromNode: string | null;
}

export const RelationshipToolbar = ({
  isCreating,
  onStartCreating,
  onCancelCreating,
  pendingFromNode,
}: RelationshipToolbarProps) => {
  return (
    <div className="flex items-center gap-2">
      {isCreating ? (
        <div className="flex items-center gap-2 px-2 py-1 bg-primary/10 border border-primary/30 rounded text-sm">
          <Link2 className="w-4 h-4 text-primary" />
          <span>
            {pendingFromNode
              ? "Click destination node"
              : "Click source node"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onCancelCreating}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onStartCreating}
          title="Add Relationship"
        >
          <Link2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

interface EditRelationshipDialogProps {
  relationship: Relationship | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<Relationship>) => void;
  onDelete: () => void;
}

export const EditRelationshipDialog = ({
  relationship,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: EditRelationshipDialogProps) => {
  const [label, setLabel] = useState(relationship?.label || "");
  const [lineStyle, setLineStyle] = useState<LineStyle>(
    relationship?.lineStyle || "solid"
  );
  const [arrowType, setArrowType] = useState<ArrowType>(
    relationship?.arrowType || "end"
  );
  const [lineColor, setLineColor] = useState(relationship?.lineColor || "");

  const handleSave = () => {
    onSave({
      label: label || undefined,
      lineStyle,
      arrowType,
      lineColor: lineColor || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Relationship</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="rel-label">Label (optional)</Label>
            <Input
              id="rel-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., depends on, related to"
            />
          </div>

          <div className="space-y-2">
            <Label>Line Style</Label>
            <Select
              value={lineStyle}
              onValueChange={(v) => setLineStyle(v as LineStyle)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Arrow Direction</Label>
            <Select
              value={arrowType}
              onValueChange={(v) => setArrowType(v as ArrowType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Arrow</SelectItem>
                <SelectItem value="end">End Arrow →</SelectItem>
                <SelectItem value="start">Start Arrow ←</SelectItem>
                <SelectItem value="both">Both Arrows ↔</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rel-color">Color (optional)</Label>
            <div className="flex gap-2">
              <Input
                id="rel-color"
                type="color"
                value={lineColor || "#666666"}
                onChange={(e) => setLineColor(e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={lineColor}
                onChange={(e) => setLineColor(e.target.value)}
                placeholder="Leave empty for theme default"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface CreateRelationshipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (options: {
    label?: string;
    lineStyle: LineStyle;
    arrowType: ArrowType;
  }) => void;
}

export const CreateRelationshipDialog = ({
  open,
  onOpenChange,
  onCreate,
}: CreateRelationshipDialogProps) => {
  const [label, setLabel] = useState("");
  const [lineStyle, setLineStyle] = useState<LineStyle>("dashed");
  const [arrowType, setArrowType] = useState<ArrowType>("end");

  const handleCreate = () => {
    onCreate({
      label: label || undefined,
      lineStyle,
      arrowType,
    });
    setLabel("");
    setLineStyle("dashed");
    setArrowType("end");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Relationship</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="new-rel-label">Label (optional)</Label>
            <Input
              id="new-rel-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., depends on, related to"
            />
          </div>

          <div className="space-y-2">
            <Label>Line Style</Label>
            <Select
              value={lineStyle}
              onValueChange={(v) => setLineStyle(v as LineStyle)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Arrow Direction</Label>
            <Select
              value={arrowType}
              onValueChange={(v) => setArrowType(v as ArrowType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Arrow</SelectItem>
                <SelectItem value="end">End Arrow →</SelectItem>
                <SelectItem value="start">Start Arrow ←</SelectItem>
                <SelectItem value="both">Both Arrows ↔</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
