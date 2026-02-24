import { cn } from "@/lib/utils";

export function DecorativeLine({ className }: { className?: string }) {
  return (
    <div className={cn("w-full overflow-hidden", className)}>
      <svg
        className="w-full h-3"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="indigenous-pattern" width="36" height="8" patternUnits="userSpaceOnUse">
            <g transform="translate(0, -1)">
              <path d="M0 5H10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M14 5L18 1L22 5L18 9L14 5Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M26 5H36" stroke="currentColor" strokeWidth="1.5" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#indigenous-pattern)" />
      </svg>
    </div>
  );
}
