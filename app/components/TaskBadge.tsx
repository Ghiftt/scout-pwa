import { cn } from "../lib/utils";
import { TaskType } from "../types";

interface TaskBadgeProps {
  type: TaskType;
  className?: string;
}

export default function TaskBadge({ type, className }: TaskBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase",
        type === "Verify"
          ? "bg-forest-50 text-forest-600"
          : "bg-amber-50 text-amber-800",
        className
      )}
    >
      {type}
    </span>
  );
}