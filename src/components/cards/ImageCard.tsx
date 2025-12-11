import { ImageData } from "@/types/framework";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

interface ImageCardProps {
  imageData: ImageData;
  compact?: boolean;
  className?: string;
}

const ImageCard = ({ imageData, compact = false, className }: ImageCardProps) => {
  if (!imageData.url) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted/50 rounded text-muted-foreground",
        compact ? "w-8 h-8" : "aspect-video",
        className
      )}>
        <ImageIcon className="w-6 h-6" />
      </div>
    );
  }

  if (compact) {
    return (
      <div className={cn("w-10 h-10 rounded overflow-hidden bg-muted flex-shrink-0", className)}>
        <img
          src={imageData.url}
          alt={imageData.alt || ""}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <figure className={cn("space-y-2", className)}>
      <div className="rounded overflow-hidden bg-muted">
        <img
          src={imageData.url}
          alt={imageData.alt || ""}
          className="w-full h-auto object-contain max-h-64"
          loading="lazy"
          style={{
            maxWidth: imageData.width ? `${imageData.width}px` : undefined,
          }}
        />
      </div>
      {imageData.caption && (
        <figcaption className="text-xs text-muted-foreground text-center">
          {imageData.caption}
        </figcaption>
      )}
    </figure>
  );
};

export default ImageCard;
