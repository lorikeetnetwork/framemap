import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface DraggableTreeNodeProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const DraggableTreeNode = ({ id, children, disabled = false }: DraggableTreeNodeProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ 
    id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "relative",
        isDragging && "z-50",
        isOver && "ring-2 ring-primary ring-offset-2 ring-offset-background rounded"
      )}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};

export default DraggableTreeNode;
