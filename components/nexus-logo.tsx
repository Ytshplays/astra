import { cn } from "@/lib/utils";

export function AstraLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        ASTRA
      </span>
    </div>
  );
}

// Export with old name for compatibility during transition
export const NexusLogo = AstraLogo;
