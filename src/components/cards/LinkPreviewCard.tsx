import { ExternalLink, Globe } from "lucide-react";
import { LinkPreview } from "@/types/framework";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface LinkPreviewCardProps {
  url: string;
  preview?: LinkPreview;
  loading?: boolean;
  compact?: boolean;
  className?: string;
}

const LinkPreviewCard = ({ url, preview, loading, compact = false, className }: LinkPreviewCardProps) => {
  if (loading) {
    return (
      <div className={cn("flex gap-3 p-2 rounded bg-muted/50", className)}>
        <Skeleton className="w-12 h-12 rounded flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
    );
  }

  if (!preview) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center gap-2 p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors text-link text-sm truncate",
          className
        )}
      >
        <Globe className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">{url}</span>
        <ExternalLink className="w-3 h-3 flex-shrink-0 ml-auto" />
      </a>
    );
  }

  if (compact) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex items-center gap-2 p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors group",
          className
        )}
      >
        {preview.favicon ? (
          <img 
            src={preview.favicon} 
            alt="" 
            className="w-4 h-4 rounded flex-shrink-0"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        ) : (
          <Globe className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
        )}
        <span className="text-sm text-foreground truncate group-hover:text-link">
          {preview.title || preview.siteName || url}
        </span>
        <ExternalLink className="w-3 h-3 flex-shrink-0 ml-auto text-muted-foreground" />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block rounded border border-border overflow-hidden hover:border-primary/50 transition-colors group",
        className
      )}
    >
      {preview.image && (
        <div className="aspect-video bg-muted overflow-hidden">
          <img
            src={preview.image}
            alt={preview.title || ""}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => (e.currentTarget.parentElement!.style.display = 'none')}
          />
        </div>
      )}
      <div className="p-3 space-y-1">
        <div className="flex items-center gap-2">
          {preview.favicon ? (
            <img 
              src={preview.favicon} 
              alt="" 
              className="w-4 h-4 rounded flex-shrink-0"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          ) : (
            <Globe className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
          )}
          <span className="text-xs text-muted-foreground truncate">
            {preview.siteName || new URL(url).hostname}
          </span>
        </div>
        {preview.title && (
          <h4 className="font-medium text-sm line-clamp-2 group-hover:text-link">
            {preview.title}
          </h4>
        )}
        {preview.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {preview.description}
          </p>
        )}
      </div>
    </a>
  );
};

export default LinkPreviewCard;
