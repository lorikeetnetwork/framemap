import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

const SearchBar = ({ value, onChange, resultCount }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search framework..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "pl-10 pr-20 bg-secondary border-tree-line",
          "focus:ring-2 focus:ring-primary/50 focus:border-primary",
          "placeholder:text-muted-foreground/50"
        )}
      />
      {value && (
        <>
          <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {resultCount} found
          </span>
          <button
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
};

export default SearchBar;
