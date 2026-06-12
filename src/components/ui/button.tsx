import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  href?: string;
}

const variants = {
  primary:
    "bg-[--color-accent] text-white hover:bg-[--color-accent-hover] border-transparent",
  secondary:
    "bg-transparent text-[--color-text-primary] border-[--color-border] hover:border-[--color-text-secondary] hover:bg-[--color-surface-hover]",
  ghost:
    "bg-transparent text-[--color-text-secondary] hover:bg-[--color-surface-hover] hover:text-[--color-text-primary] border-transparent",
  danger:
    "bg-[--color-error] text-white hover:opacity-90 border-transparent",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-md",
  md: "px-5 py-2.5 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center font-medium border transition-colors duration-150",
    variants[variant],
    sizes[size],
    props.disabled && "opacity-50 cursor-not-allowed",
    className,
  );

  if (href) {
    return <Link href={href} className={classes}>{props.children}</Link>;
  }

  return <button className={classes} {...props} />;
}

// Utility for className merging (minimal)
export { cn };
