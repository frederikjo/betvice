// src/components/ui/Icon.tsx
import React from "react";
import * as LucideIcons from "lucide-react";
import * as CustomIcons from "../svg"; // We'll create this SVG index file in Step 2

interface IconProps {
  icon: string;
  size?: number | string;
  color?: string;
  className?: string;
  onClick?: () => void;
}

const Icon: React.FC<IconProps> = ({
  icon,
  size = 24,
  color,
  className = "",
  onClick,
  ...props
}) => {
  // Check if the icon is from Lucide (starts with "Fi", "Md", etc.)
  const isLucideIcon = icon in LucideIcons;

  // Check if it's a custom SVG icon from our assets
  const isCustomIcon = icon in CustomIcons;

  if (!isLucideIcon && !isCustomIcon) {
    console.warn(
      `Icon "${icon}" not found in either Lucide or custom icons`
    );
    return null;
  }

  // For Lucide icons
  if (isLucideIcon) {
    const LucideIcon = LucideIcons[
      icon as keyof typeof LucideIcons
    ] as React.ComponentType<any>;
    return (
      <LucideIcon
        size={size}
        color={color}
        className={className}
        onClick={onClick}
        {...props}
      />
    );
  }

  // For custom SVG icons
  const CustomIcon = CustomIcons[icon as keyof typeof CustomIcons];
  return (
    <CustomIcon
      width={size}
      height={size}
      className={className}
      onClick={onClick}
      style={{ color }}
      {...props}
    />
  );
};

export default Icon;
