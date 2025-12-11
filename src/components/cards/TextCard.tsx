import { cn } from "@/lib/utils";

interface TextCardProps {
  content: string;
  compact?: boolean;
  className?: string;
}

const TextCard = ({ content, compact = false, className }: TextCardProps) => {
  if (!content) return null;

  if (compact) {
    return (
      <p className={cn("text-xs text-muted-foreground line-clamp-2", className)}>
        {content}
      </p>
    );
  }

  return (
    <div className={cn("prose prose-sm prose-invert max-w-none", className)}>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
};

export default TextCard;
