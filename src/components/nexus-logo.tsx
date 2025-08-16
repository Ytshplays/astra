import { cn } from "@/lib/utils";

export function NexusLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path
          d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M2 7L12 12L22 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M12 22V12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      <h1 className="text-xl font-bold text-foreground group-data-[collapsible=icon]/sidebar-wrapper:hidden">
        Nexus Hub
      </h1>
    </div>
  );
}
