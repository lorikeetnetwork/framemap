import { useState, useEffect } from "react";
import { Plus, Folder, Link2, FileText, CheckSquare, Layers, LayoutList, Image, Type, Loader2 } from "lucide-react";
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
import ImageUploader from "./ImageUploader";
import LinkPreviewCard from "./cards/LinkPreviewCard";
import useLinkPreview from "@/hooks/useLinkPreview";

interface AddNodeDialogProps {
  onAdd: (node: FrameworkNode) => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const nodeTypes: { type: NodeType; label: string; icon: React.ElementType; description: string }[] = [
  { type: "topic", label: "Topic", icon: Layers, description: "Main section" },
  { type: "subtopic", label: "Subtopic", icon: LayoutList, description: "Sub-section" },
  { type: "folder", label: "Folder", icon: Folder, description: "Group items" },
  { type: "link", label: "Link", icon: Link2, description: "External URL" },
  { type: "image", label: "Image", icon: Image, description: "Image card" },
  { type: "text", label: "Text", icon: Type, description: "Text content" },
  { type: "note", label: "Note", icon: FileText, description: "Quick note" },
  { type: "task", label: "Task", icon: CheckSquare, description: "To-do item" },
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
  
  const [selectedType, setSelectedType] = useState<NodeType>("topic");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [fetchingPreview, setFetchingPreview] = useState(false);

  const { preview, loading: previewLoading, fetchPreview } = useLinkPreview(undefined);
  const [localPreview, setLocalPreview] = useState(preview);

  useEffect(() => {
    setLocalPreview(preview);
  }, [preview]);

  const resetForm = () => {
    setName("");
    setUrl("");
    setDescription("");
    setContent("");
    setImageUrl("");
    setImageCaption("");
    setSelectedType("topic");
    setLocalPreview(null);
  };

  const handleFetchPreview = async () => {
    if (!url.trim()) return;
    setFetchingPreview(true);
    const result = await fetchPreview(url.trim());
    if (result) {
      setLocalPreview(result);
      // Auto-fill name from title if empty
      if (!name.trim() && result.title) {
        setName(result.title);
      }
    }
    setFetchingPreview(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newNode: FrameworkNode = {
      name: name.trim(),
      type: selectedType,
    };

    // Topic and subtopic get children array
    if (selectedType === "topic" || selectedType === "subtopic" || selectedType === "folder") {
      newNode.children = [];
    }

    // Description for notes, tasks, topics, subtopics
    if ((selectedType === "note" || selectedType === "task" || selectedType === "topic" || selectedType === "subtopic") && description.trim()) {
      newNode.description = description.trim();
    }

    // Link with preview
    if (selectedType === "link" && url.trim()) {
      newNode.url = url.trim();
      if (localPreview) {
        newNode.linkPreview = localPreview;
      }
    }

    // Task completion
    if (selectedType === "task") {
      newNode.completed = false;
    }

    // Image data
    if (selectedType === "image" && imageUrl) {
      newNode.imageData = {
        url: imageUrl,
        caption: imageCaption.trim() || undefined,
      };
    }

    // Text content
    if (selectedType === "text" && content.trim()) {
      newNode.content = content.trim();
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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">Add New Card</DialogTitle>
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
                  "flex flex-col items-center gap-1 p-2 rounded border transition-all",
                  selectedType === type
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
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
              placeholder="Enter name..."
              autoFocus
            />
          </div>

          {/* URL input for links */}
          {selectedType === "link" && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleFetchPreview}
                    disabled={!url.trim() || fetchingPreview}
                  >
                    {fetchingPreview ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Preview"
                    )}
                  </Button>
                </div>
              </div>
              {/* Link preview */}
              {(localPreview || previewLoading) && url && (
                <LinkPreviewCard 
                  url={url} 
                  preview={localPreview || undefined} 
                  loading={previewLoading || fetchingPreview}
                />
              )}
            </div>
          )}

          {/* Image uploader */}
          {selectedType === "image" && (
            <div className="space-y-3">
              <Label>Image</Label>
              <ImageUploader
                onImageSelect={setImageUrl}
                currentUrl={imageUrl}
              />
              <div className="space-y-2">
                <Label htmlFor="caption">Caption (optional)</Label>
                <Input
                  id="caption"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Image caption..."
                />
              </div>
            </div>
          )}

          {/* Text content */}
          {selectedType === "text" && (
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter text content..."
                rows={5}
              />
            </div>
          )}

          {/* Description for notes, tasks, topics, subtopics */}
          {(selectedType === "note" || selectedType === "task" || selectedType === "topic" || selectedType === "subtopic") && (
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

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Add Card
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNodeDialog;
