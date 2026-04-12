import {
  Code,
  Book,
  Coffee,
  Dumbbell,
  Briefcase,
  Zap,
  Calendar,
  Heart,
  ShoppingCart,
  Music,
  Gamepad2,
  Plane,
  Monitor,
  PenTool,
  Star,
  Camera,
  Home,
  MessageCircle,
  Phone,
  Utensils,
  type LucideIcon,
} from 'lucide-react-native';

/**
 * Strict Icon Registry
 * Maps string keys to actual Lucide icon components for safe rendering.
 */
export const ICON_REGISTRY: Record<string, LucideIcon> = {
  Code,
  Book,
  Coffee,
  Dumbbell,
  Briefcase,
  Zap,
  Calendar,
  Heart,
  ShoppingCart,
  Music,
  Gamepad2,
  Plane,
  Monitor,
  PenTool,
  Star,
  Camera,
  Home,
  MessageCircle,
  Phone,
  Utensils,
} as const;

export type IconName = keyof typeof ICON_REGISTRY;

export const ICON_NAMES = Object.keys(ICON_REGISTRY) as IconName[];
