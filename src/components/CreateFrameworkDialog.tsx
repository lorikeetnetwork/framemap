import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFrameworkMaps } from "@/hooks/useFrameworkMaps";
import { FrameworkNode } from "@/types/framework";

const defaultFrameworkData: FrameworkNode = {
  name: "New Framework",
  type: "folder",
  children: [
    {
      name: "Getting Started",
      type: "note",
      description: "Double-click to edit this node. Right-click for more options.",
    },
    {
      name: "Category 1",
      type: "folder",
      children: [
        {
          name: "Sub-item 1",
          type: "note",
        },
        {
          name: "Sub-item 2",
          type: "note",
        },
      ],
    },
    {
      name: "Category 2",
      type: "folder",
      children: [],
    },
  ],
};

const CreateFrameworkDialog = () => {
  const navigate = useNavigate();
  const { saveMap } = useFrameworkMaps();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;

    setLoading(true);
    
    // Create framework data with the provided name
    const frameworkData: FrameworkNode = {
      ...defaultFrameworkData,
      name: name.trim(),
    };

    const result = await saveMap(name.trim(), frameworkData, description.trim() || undefined);
    
    setLoading(false);

    if (result) {
      setOpen(false);
      setName("");
      setDescription("");
      navigate(`/frameworks/${result.id}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Framework
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Framework</DialogTitle>
          <DialogDescription>
            Start a new framework from scratch. You can organize ideas, projects, or any hierarchical content.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="My Framework"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  handleCreate();
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe the purpose of this framework..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim() || loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Framework
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFrameworkDialog;
