import { cn } from "@/lib/utils";
import Image from "next/image";

export function AstraLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src="/ASTRA_(1)[1].png"
        alt="Astra"
        width={32}
        height={32}
        className="rounded-lg"
        priority
      />
    </div>
  );
}

// Export with old name for compatibility during transition
export const NexusLogo = AstraLogo;
