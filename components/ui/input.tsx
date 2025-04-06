"use client"

import * as React from "react"
import { cn } from "../../lib/utils"


  type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", value, ...props }, ref) => {
    const inputValue = typeof value === "string" ? value : ""
    return (
      <input
        type={type}
        value={inputValue}
        size={inputValue.length || 1}
        className={cn(
          "inline-flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
