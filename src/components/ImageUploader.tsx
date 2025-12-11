import { useState, useRef } from "react";
import { Upload, Link2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageSelect: (url: string) => void;
  currentUrl?: string;
  className?: string;
}

const ImageUploader = ({ onImageSelect, currentUrl, className }: ImageUploaderProps) => {
  const { user } = useAuth();
  const [mode, setMode] = useState<"upload" | "url">("url");
  const [urlInput, setUrlInput] = useState(currentUrl || "");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setPreviewUrl(urlInput.trim());
      onImageSelect(urlInput.trim());
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('framework-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('framework-images')
        .getPublicUrl(fileName);

      setPreviewUrl(publicUrl);
      onImageSelect(publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setPreviewUrl("");
    setUrlInput("");
    onImageSelect("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Mode toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === "url" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("url")}
        >
          <Link2 className="w-4 h-4 mr-1" />
          URL
        </Button>
        <Button
          type="button"
          variant={mode === "upload" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("upload")}
          disabled={!user}
        >
          <Upload className="w-4 h-4 mr-1" />
          Upload
        </Button>
      </div>

      {/* URL input */}
      {mode === "url" && (
        <div className="flex gap-2">
          <Input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1"
          />
          <Button type="button" onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
            Add
          </Button>
        </div>
      )}

      {/* File upload */}
      {mode === "upload" && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <Label
            htmlFor="image-upload"
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded cursor-pointer transition-colors",
              "hover:border-primary/50 hover:bg-muted/50",
              uploading && "pointer-events-none opacity-50"
            )}
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="w-8 h-8 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground">
              {uploading ? "Uploading..." : "Click to upload image"}
            </span>
          </Label>
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full max-h-48 object-contain rounded bg-muted"
            onError={() => {
              setPreviewUrl("");
              toast.error("Failed to load image");
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={clearImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
