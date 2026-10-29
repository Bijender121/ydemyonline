import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { Icon, PlayCircleIcon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "text";
/** Text variant: `sm` 12px (in-card actions), `md` 14px, `lg`/`xl` 16px. */
export type ButtonSize = "sm" | "md" | "lg" | "xl";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400 disabled:pointer-events-none aria-disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "rounded-md bg-primary-500 text-white hover:bg-primary-600 disabled:bg-primary-100 disabled:text-primary-300 aria-disabled:bg-primary-100 aria-disabled:text-primary-300",
  secondary:
    "rounded-md border border-primary-400 bg-white text-primary-500 hover:bg-primary-100 hover:border-primary-500 disabled:border-primary-100 disabled:text-primary-300 aria-disabled:border-primary-100 aria-disabled:text-primary-300",
  tertiary:
    "rounded-md border border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300 hover:bg-neutral-50 disabled:text-neutral-300 disabled:border-neutral-100 aria-disabled:text-neutral-300 aria-disabled:border-neutral-100",
  text: "rounded-xs text-primary-500 hover:text-primary-600 disabled:text-primary-300 aria-disabled:text-primary-300",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-11 px-3 text-body",
  md: "h-11 px-3 text-body",
  lg: "h-11 px-4 text-body-lg",
  /** Hero call to action. */
  xl: "h-15 px-6 text-heading-3",
};

const textSizes: Record<ButtonSize, string> = {
  sm: "text-small",
  md: "text-body",
  lg: "text-body-lg",
  xl: "text-body-lg",
};

const trailingIcons: Partial<Record<ButtonVariant, ReactNode>> = {
  tertiary: <Icon icon={ExternalLink} className="size-4" />,
  text: <PlayCircleIcon />,
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Show the variant's default trailing icon (external link / play). */
  withIcon?: boolean;
  trailing?: ReactNode;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<"button">, keyof CommonProps> & { href?: undefined };
type ButtonAsLink = CommonProps &
  Omit<ComponentProps<typeof Link>, keyof CommonProps> & {
    href: string;
    disabled?: boolean;
  };

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: Pick<CommonProps, "variant" | "size" | "className">) {
  const sizing = variant === "text" ? textSizes[size] : sizes[size];
  return cn(base, variants[variant], sizing, className);
}

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = "primary",
    size = "md",
    withIcon = false,
    trailing,
    className,
    children,
    ...rest
  } = props;
  const classes = buttonClasses({ variant, size, className });
  const content = (
    <>
      {children}
      {trailing ?? (withIcon ? trailingIcons[variant] : null)}
    </>
  );

  if (rest.href !== undefined) {
    const { disabled, ...linkProps } = rest as Omit<ButtonAsLink, keyof CommonProps>;
    return (
      <Link
        {...linkProps}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = rest as Omit<ButtonAsButton, keyof CommonProps>;
  return (
    <button type={type} {...buttonProps} className={classes}>
      {content}
    </button>
  );
}
