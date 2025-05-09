// src/components/ui/Icon.tsx
import React from "react";
import * as LucideIcons from "lucide-react";
import * as CustomIcons from "../svg";

interface IconProps {
  icon: string;
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * Converts a pixel value to rem
 * @param px Pixel value to convert
 * @param base Base font size (default: 16)
 * @returns Value in rem units
 */
const pxToRem = (px: number, base: number = 16): string => {
  return `${px / base}rem`;
};

/**
 * Formats size values to appropriate CSS units
 * @param size Size value (number or string)
 * @returns Formatted size value with units
 */
const formatSize = (
  size: number | string | undefined
): string | undefined => {
  if (size === undefined) return undefined;

  if (typeof size === "number") {
    return pxToRem(size); // Convert pixels to rem
  }

  // If it's already a string with units, return as is
  if (
    typeof size === "string" &&
    (size.endsWith("px") ||
      size.endsWith("rem") ||
      size.endsWith("%") ||
      size.endsWith("em") ||
      size.endsWith("vh") ||
      size.endsWith("vw"))
  ) {
    return size;
  }

  // For bare numbers as strings, interpret as pixels and convert to rem
  if (typeof size === "string" && !isNaN(Number(size))) {
    return pxToRem(Number(size));
  }

  return size; // Return as is for other formats
};

const Icon: React.FC<IconProps> = ({
  icon,
  width = 24,
  height,
  color,
  className = "",
  onClick,
  style,
  ...props
}) => {
  // Use the same value for height if not explicitly provided
  const finalHeight = height !== undefined ? height : width;

  // Format width and height values
  const formattedWidth = formatSize(width);
  const formattedHeight = formatSize(finalHeight);

  // Check if the icon is from Lucide
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

    // Lucide icons typically take a 'size' prop,
    // but we'll override with explicit width/height if provided
    return (
      <LucideIcon
        size={width} // Use width as the size
        color={color}
        className={className}
        onClick={onClick}
        style={{
          ...(formattedWidth !== undefined && {
            width: formattedWidth,
          }),
          ...(formattedHeight !== undefined && {
            height: formattedHeight,
          }),
          ...style,
        }}
        {...props}
      />
    );
  }

  // For custom SVG icons
  const CustomIcon = CustomIcons[
    icon as keyof typeof CustomIcons
  ] as any;

  return (
    <CustomIcon
      className={className}
      onClick={onClick}
      style={{
        color,
        width: formattedWidth,
        height: formattedHeight,
        ...style,
      }}
      {...props}
    />
  );
};

export default Icon;
