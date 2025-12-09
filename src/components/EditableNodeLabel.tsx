import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface EditableNodeLabelProps {
  value: string;
  isEditing: boolean;
  onSave: (newValue: string) => void;
  onCancel: () => void;
  className?: string;
}

const EditableNodeLabel = ({
  value,
  isEditing,
  onSave,
  onCancel,
  className,
}: EditableNodeLabelProps) => {
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editValue.trim()) {
        onSave(editValue.trim());
      } else {
        onCancel();
      }
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  const handleBlur = () => {
    if (editValue.trim() && editValue !== value) {
      onSave(editValue.trim());
    } else {
      onCancel();
    }
  };

  if (!isEditing) {
    return null;
  }

  return (
    <Input
      ref={inputRef}
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className={cn(
        "h-6 py-0 px-1 text-sm bg-input border-primary/50 focus:border-primary",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    />
  );
};

export default EditableNodeLabel;
