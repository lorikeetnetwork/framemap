import { useState } from "react";
import { Plus, Folder, Link2, FileText, CheckSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FrameworkNode, NodeType } from "@/types/framework";
import { cn } from "@/lib/utils";

interface AddNodeDialogProps {
  onAdd: (node: FrameworkNode) => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const nodeTypes: { type: NodeType; label: string; icon: React.ElementType; description: string }[] = [
  { type: "folder", label: "Folder", icon: Folder, description: "Group related items" },
  { type: "link", label: "Link", icon: Link2, description: "External URL" },
  { type: "note", label: "Note", icon: FileText, description: "Text note" },
  { type: "task", label: "Task", icon: CheckSquare, description: "Actionable item" },
];

const AddNodeDialog = ({ onAdd, trigger, open: controlledOpen, onOpenChange }: AddNodeDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Support both controlled and uncontrolled modes
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
  };
  
  const [selectedType, setSelectedType] = useState<NodeType>("folder");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setName("");
    setUrl("");
    setDescription("");
    setSelectedType("folder");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newNode: FrameworkNode = {
      name: name.trim(),
      type: selectedType,
    };

    if (selectedType === "folder") {
      newNode.children = [];
    }

    if (selectedType === "link" && url.trim()) {
      newNode.url = url.trim();
    }

    if ((selectedType === "note" || selectedType === "task") && description.trim()) {
      newNode.description = description.trim();
    }

    if (selectedType === "task") {
      newNode.completed = false;
    }

    onAdd(newNode);
    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Only render trigger if provided or not in controlled mode */}
      {(trigger || !isControlled) && (
        <DialogTrigger asChild>
          {trigger || (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
            >
              <Plus className="h-3 w-3" />
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">Add New Node</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Node type selection */}
          <div className="grid grid-cols-4 gap-2">
            {nodeTypes.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded border transition-all",
                  selectedType === type
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>

          {/* Name input */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter node name..."
              autoFocus
            />
          </div>

          {/* URL input for links */}
          {selectedType === "link" && (
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          )}

          {/* Description for notes and tasks */}
          {(selectedType === "note" || selectedType === "task") && (
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details..."
                rows={3}
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Add Node
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNodeDialog;
