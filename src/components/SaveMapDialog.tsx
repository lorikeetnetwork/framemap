import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Save, Loader2 } from 'lucide-react';
import { FrameworkNode } from '@/types/framework';

interface SaveMapDialogProps {
  data: FrameworkNode;
  onSave: (name: string, data: FrameworkNode, description?: string) => Promise<unknown>;
}

const SaveMapDialog = ({ data, onSave }: SaveMapDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    
    setLoading(true);
    const result = await onSave(name.trim(), data, description.trim() || undefined);
    setLoading(false);
    
    if (result) {
      setOpen(false);
      setName('');
      setDescription('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-tree-line hover:bg-tree-node-hover hover:text-primary"
        >
          <Save className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Save</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-tree-line">
        <DialogHeader>
          <DialogTitle className="text-primary">Save Framework Map</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Save the current framework map to your account for later use.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="map-name" className="text-foreground">Name</Label>
            <Input
              id="map-name"
              placeholder="My Framework Map"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary border-tree-line focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="map-description" className="text-foreground">
              Description <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="map-description"
              placeholder="A brief description of this map..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-secondary border-tree-line focus:border-primary resize-none"
              rows={3}
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Map
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaveMapDialog;
