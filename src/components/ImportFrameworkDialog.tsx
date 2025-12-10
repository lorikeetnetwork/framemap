import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Loader2, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";

interface ImportedData {
  name?: string;
  description?: string;
  data?: FrameworkNode;
}

interface ImportFrameworkDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const ImportFrameworkDialog = ({ open: controlledOpen, onOpenChange, trigger }: ImportFrameworkDialogProps) => {
  const navigate = useNavigate();
  const { saveMap } = useFrameworkMaps();
  const [internalOpen, setInternalOpen] = useState(false);
  const [name, setName] = useState("");
  const [importedData, setImportedData] = useState<FrameworkNode | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpenState = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  const validateFrameworkNode = (data: unknown): data is FrameworkNode => {
    if (!data || typeof data !== 'object') return false;
    const node = data as Record<string, unknown>;
    if (typeof node.name !== 'string') return false;
    if (node.children !== undefined && !Array.isArray(node.children)) return false;
    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Please select a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed: ImportedData = JSON.parse(content);

        // Check if it's our export format (with data property) or raw framework data
        let frameworkData: FrameworkNode;
        let frameworkName = name;

        if (parsed.data && validateFrameworkNode(parsed.data)) {
          frameworkData = parsed.data;
          frameworkName = parsed.name || file.name.replace('.json', '');
        } else if (validateFrameworkNode(parsed)) {
          frameworkData = parsed as unknown as FrameworkNode;
          frameworkName = (parsed as unknown as FrameworkNode).name || file.name.replace('.json', '');
        } else {
          throw new Error('Invalid framework structure');
        }

        setImportedData(frameworkData);
        setFileName(file.name);
        if (!name) {
          setName(frameworkName);
        }
        toast.success('File loaded successfully');
      } catch (error) {
        console.error('Import error:', error);
        toast.error('Invalid JSON file or framework structure');
        setImportedData(null);
        setFileName("");
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!importedData || !name.trim()) return;

    setLoading(true);

    // Update the root node name to match the provided name
    const frameworkData: FrameworkNode = {
      ...importedData,
      name: name.trim(),
    };

    const result = await saveMap(name.trim(), frameworkData);
    
    setLoading(false);

    if (result) {
      setOpenState(false);
      resetState();
      navigate(`/frameworks/${result.id}`);
    }
  };

  const resetState = () => {
    setName("");
    setImportedData(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpenState(newOpen);
    if (!newOpen) {
      resetState();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Framework</DialogTitle>
          <DialogDescription>
            Import a framework from a JSON file. The file should contain valid framework data.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select File</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept=".json"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full justify-start"
              >
                <FileJson className="w-4 h-4 mr-2" />
                {fileName || 'Choose JSON file...'}
              </Button>
            </div>
          </div>
          
          {importedData && (
            <div className="space-y-2">
              <Label htmlFor="import-name">Framework Name</Label>
              <Input
                id="import-name"
                placeholder="My Imported Framework"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Found {countNodes(importedData)} nodes in the imported file
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!importedData || !name.trim() || loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Import Framework
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Helper to count nodes in the framework
function countNodes(node: FrameworkNode): number {
  let count = 1;
  if (node.children) {
    for (const child of node.children) {
      count += countNodes(child);
    }
  }
  return count;
}

export default ImportFrameworkDialog;
