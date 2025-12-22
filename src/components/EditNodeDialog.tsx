import { useState, useEffect } from "react";
import { Folder, Link2, FileText, CheckSquare, Layers, LayoutList, Image, Type, Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FrameworkNode, NodeType, NodeStyle } from "@/types/framework";
import { cn } from "@/lib/utils";
import ImageUploader from "./ImageUploader";
import LinkPreviewCard from "./cards/LinkPreviewCard";
import useLinkPreview from "@/hooks/useLinkPreview";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface EditNodeDialogProps {
  node: FrameworkNode | null;
  nodePath: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (nodePath: string, updates: Partial<FrameworkNode>) => void;
  onDelete?: (nodePath: string) => void;
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

const colorOptions = [
  { label: "Default", value: undefined },
  { label: "Green", value: "160 100% 45%" },
  { label: "Blue", value: "200 100% 50%" },
  { label: "Purple", value: "270 100% 60%" },
  { label: "Orange", value: "30 100% 50%" },
  { label: "Red", value: "0 100% 50%" },
  { label: "Yellow", value: "50 100% 50%" },
];

const EditNodeDialog = ({ 
  node, 
  nodePath, 
  open, 
  onOpenChange, 
  onSave, 
  onDelete 
}: EditNodeDialogProps) => {
  const [selectedType, setSelectedType] = useState<NodeType>("topic");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [completed, setCompleted] = useState(false);
  const [color, setColor] = useState<string | undefined>(undefined);
  const [fetchingPreview, setFetchingPreview] = useState(false);

  const { fetchPreview } = useLinkPreview(undefined);
  const [localPreview, setLocalPreview] = useState(node?.linkPreview || null);

  // Initialize form when node changes
  useEffect(() => {
    if (node) {
      setName(node.name || "");
      setSelectedType(node.type || "folder");
      setUrl(node.url || "");
      setDescription(node.description || "");
      setContent(node.content || "");
      setImageUrl(node.imageData?.url || "");
      setImageCaption(node.imageData?.caption || "");
      setCompleted(node.completed || false);
      setColor(node.color);
      setLocalPreview(node.linkPreview || null);
    }
  }, [node, open]);

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
    if (!nodePath || !name.trim()) return;

    const updates: Partial<FrameworkNode> = {
      name: name.trim(),
      type: selectedType,
      color,
    };

    // Container types need children array if not present
    if ((selectedType === "topic" || selectedType === "subtopic" || selectedType === "folder") && !node?.children) {
      updates.children = [];
    }

    // Handle description
    if (selectedType === "note" || selectedType === "task" || selectedType === "topic" || selectedType === "subtopic") {
      updates.description = description.trim() || undefined;
    } else {
      updates.description = undefined;
    }

    // Handle link
    if (selectedType === "link" && url.trim()) {
      updates.url = url.trim();
      updates.linkPreview = localPreview || undefined;
    } else {
      updates.url = undefined;
      updates.linkPreview = undefined;
    }

    // Handle task
    if (selectedType === "task") {
      updates.completed = completed;
    } else {
      updates.completed = undefined;
    }

    // Handle image
    if (selectedType === "image" && imageUrl) {
      updates.imageData = {
        url: imageUrl,
        caption: imageCaption.trim() || undefined,
      };
    } else {
      updates.imageData = undefined;
    }

    // Handle text
    if (selectedType === "text" && content.trim()) {
      updates.content = content.trim();
    } else {
      updates.content = undefined;
    }

    onSave(nodePath, updates);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (nodePath && onDelete) {
      onDelete(nodePath);
      onOpenChange(false);
    }
  };

  if (!node || !nodePath) return null;

  const isRootNode = !nodePath.includes("/");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">Edit Node</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="general" className="space-y-4 mt-4">
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
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name..."
                />
              </div>

              {/* Description for notes, tasks, topics, subtopics */}
              {(selectedType === "note" || selectedType === "task" || selectedType === "topic" || selectedType === "subtopic") && (
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description (optional)</Label>
                  <Textarea
                    id="edit-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add details..."
                    rows={3}
                  />
                </div>
              )}

              {/* Task completion toggle */}
              {selectedType === "task" && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit-completed"
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <Label htmlFor="edit-completed">Mark as completed</Label>
                </div>
              )}
            </TabsContent>

            <TabsContent value="content" className="space-y-4 mt-4">
              {/* URL input for links */}
              {selectedType === "link" && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="edit-url">URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="edit-url"
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
                  {localPreview && url && (
                    <LinkPreviewCard 
                      url={url} 
                      preview={localPreview} 
                      loading={fetchingPreview}
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
                    <Label htmlFor="edit-caption">Caption (optional)</Label>
                    <Input
                      id="edit-caption"
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
                  <Label htmlFor="edit-content">Content</Label>
                  <Textarea
                    id="edit-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter text content..."
                    rows={6}
                  />
                </div>
              )}

              {/* Placeholder for non-content types */}
              {selectedType !== "link" && selectedType !== "image" && selectedType !== "text" && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>This node type doesn't have additional content options.</p>
                  <p className="text-sm mt-1">Use the General tab to edit name and description.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="style" className="space-y-4 mt-4">
              {/* Color selection */}
              <div className="space-y-2">
                <Label>Node Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setColor(option.value)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded border transition-all",
                        color === option.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {option.value ? (
                        <div
                          className="h-4 w-4 rounded-full border border-border"
                          style={{ backgroundColor: `hsl(${option.value})` }}
                        />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-border bg-muted" />
                      )}
                      <span className="text-sm">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <div 
                  className="p-4 rounded border border-border bg-card"
                  style={color ? { borderLeftWidth: "4px", borderLeftColor: `hsl(${color})` } : undefined}
                >
                  <span className="font-medium">{name || "Node Name"}</span>
                  {description && (
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                  )}
                </div>
              </div>
            </TabsContent>

            <DialogFooter className="mt-6 flex justify-between gap-2">
              {!isRootNode && onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Node?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will delete "{name}" and all its children. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <div className="flex gap-2 ml-auto">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!name.trim()}>
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditNodeDialog;
