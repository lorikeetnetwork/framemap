import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FolderOpen, Trash2, Loader2 } from 'lucide-react';
import { FrameworkMap } from '@/hooks/useFrameworkMaps';
import { FrameworkNode } from '@/types/framework';
import { formatDistanceToNow } from 'date-fns';

interface LoadMapDialogProps {
  maps: FrameworkMap[];
  loading: boolean;
  onLoad: (data: FrameworkNode, map?: FrameworkMap) => void;
  onDelete: (id: string) => Promise<boolean>;
}

const LoadMapDialog = ({ maps, loading, onLoad, onDelete }: LoadMapDialogProps) => {
  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleLoad = (map: FrameworkMap) => {
    onLoad(map.data, map);
    setOpen(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-tree-line hover:bg-tree-node-hover hover:text-primary"
        >
          <FolderOpen className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Load</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-tree-line max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-primary">Load Framework Map</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select a saved framework map to load.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : maps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No saved maps yet</p>
              <p className="text-sm mt-1">Save a map to see it here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {maps.map((map) => (
                <div
                  key={map.id}
                  onClick={() => handleLoad(map)}
                  className="group p-3 rounded-lg border border-tree-line hover:border-primary hover:bg-tree-node-hover cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {map.name}
                      </h4>
                      {map.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {map.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Updated {formatDistanceToNow(new Date(map.updated_at), { addSuffix: true })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDelete(e, map.id)}
                      disabled={deletingId === map.id}
                      className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      {deletingId === map.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadMapDialog;
