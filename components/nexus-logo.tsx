import { cn } from "@/lib/utils";

export function AstraLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
        <span className="text-white font-bold text-lg">A</span>
      </div>
    </div>
  );
}

// Export with old name for compatibility during transition
export const NexusLogo = AstraLogo;
