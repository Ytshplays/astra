import { cn } from "@/lib/utils";
import Image from "next/image";

export function AstraLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/ASTRA_(1)[1].png"
        alt="Astra Logo"
        width={28}
        height={28}
        className="rounded-lg"
        priority
      />
    </div>
  );
}

// Export with old name for compatibility during transition
export const NexusLogo = AstraLogo;
