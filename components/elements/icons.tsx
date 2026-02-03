import React from "react";
import { BadgePercent, MapPinPlus, Unlink2, Utensils, LucideProps } from "lucide-react";

const ICON_MAP = {
  utensils: Utensils,
  unlink: Unlink2,
  discount: BadgePercent,
  alt_location: MapPinPlus,
} as const;

type IconName = keyof typeof ICON_MAP;

interface IconsProps extends LucideProps {
  name: IconName | string;
}

export default function Icons({ name, ...props }: IconsProps) {
  const IconComponent = ICON_MAP[name as IconName];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent {...props} />;
}
