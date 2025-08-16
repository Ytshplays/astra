import { cn } from "@/lib/utils";
import Image from "next/image";

export function AstraLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/ASTRA_(1)[1].png"
        alt="Astra"
        width={28}
        height={28}
        className="rounded-lg"
        priority
      />
      <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        ASTRA
      </span>
    </div>
  );
}

// Export with old name for compatibility during transition
export const NexusLogo = AstraLogo;
