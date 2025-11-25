import { ComponentProps } from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-10 sm:h-9 md:h-10 w-full min-w-0 rounded border bg-transparent px-3 sm:px-2 md:px-3 py-2 sm:py-1 md:py-2 text-responsive-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-6 sm:file:h-5 md:file:h-6 file:border-0 file:bg-transparent file:text-responsive-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 touch-target",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[2px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
