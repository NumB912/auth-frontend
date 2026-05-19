import React from "react";

type LabelVariant = "success" | "failed" | "warning" | "info";
type LabelSize = "sm" | "md" | "lg";

interface LabelProps {
  variant: LabelVariant;
  children: React.ReactNode;
  size?: LabelSize;
  icon?: boolean;
  className?: string;
}

const variantConfig: Record<
  LabelVariant,
  {
    bg: string;
    text: string;
    border: string;
    dot: string;
    icon: string;
    label: string;
  }
> = {
  success: {
    bg: "bg-emerald-500",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    icon: "✓",
    label: "Success",
  },
  failed: {
    bg: "bg-white",
    text: "text-red-500",
    border: "border-red-500",
    dot: "bg-red-500",
    icon: "✕",
    label: "Failed",
  },
  warning: {
    bg: "bg-amber-500",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    icon: "!",
    label: "Warning",
  },
  info: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
    icon: "i",
    label: "Info",
  },
};

const sizeConfig: Record<LabelSize, { text: string; px: string; py: string; iconSize: string; dotSize: string }> = {
  sm: {
    text: "text-xs",
    px: "px-2",
    py: "py-1.5",
    iconSize: "w-3.5 h-3.5 text-[9px]",
    dotSize: "w-1.5 h-1.5",
  },
  md: {
    text: "text-sm",
    px: "px-2.5",
    py: "py-1",
    iconSize: "w-4 h-4 text-[10px]",
    dotSize: "w-2 h-2",
  },
  lg: {
    text: "text-base",
    px: "px-3",
    py: "py-1.5",
    iconSize: "w-5 h-5 text-xs",
    dotSize: "w-2.5 h-2.5",
  },
};

export const Label: React.FC<LabelProps> = ({
  variant,
  children,
  size = "md",
  icon = true,
  className = "",
}) => {
  const v = variantConfig[variant];
  const s = sizeConfig[size];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${v.bg} ${v.text} ${v.border}
        ${s.text} ${s.px} ${s.py}
        ${className}
      `}
    >
      {icon && (
        <span
          className={`
            inline-flex items-center justify-center rounded-full shrink-0
            ${v.dot} text-white
            ${s.iconSize}
          `}
          aria-hidden="true"
        >
          {v.icon}
        </span>
      )}
      {children}
    </span>
  );
};

export default Label;