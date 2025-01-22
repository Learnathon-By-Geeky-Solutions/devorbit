import * as React from "react";
import Link from "next/link";
import { VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm  transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden",
  {
    variants: {
      variant: {
        default: `
          bg-primary text-primary-foreground 
          before:absolute before:content-[''] before:bottom-0 before:left-0 before:w-full before:h-1 
          before:bg-gradient-to-r before:from-green-700 before:via-green-800 before:to-green-900
          before:opacity-0 before:blur-[2px]
          after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-6 
          after:bg-gradient-to-t after:from-green-200/20 after:to-transparent 
          after:opacity-0
          hover:before:opacity-100 hover:after:opacity-100
          before:transition-all before:duration-300 before:ease-in-out
          after:transition-all after:duration-300 after:ease-in-out
        `,
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors duration-300 shadow-[0_0_15px_-3px] shadow-destructive/30 hover:shadow-destructive/50",
        success:
          "bg-green-600 text-white hover:bg-green-700 transition-colors duration-300 shadow-[0_0_15px_-3px] shadow-green-600/30 hover:shadow-green-600/50",
      },
      size: {
        default: "h-10 py-2 px-4 rounded-full",
        sm: "h-9 px-2 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, href, variant, size, ...props }, ref) => {
    if (href) {
      return (
        <Link
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
        >
          {children}
        </Link>
      );
    }
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
