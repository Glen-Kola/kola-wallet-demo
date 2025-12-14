import {
  Target as TargetIcon,
  ShieldCheck,
  Plane,
  Home,
  GraduationCap,
  CarFront,
  Heart,
  Briefcase,
  BookOpen,
  PiggyBank,
} from "lucide-react";

type IconComponent = (props: { className?: string }) => JSX.Element;

export const iconMap: Record<string, IconComponent> = {
  leaf: TargetIcon,
  shield: ShieldCheck,
  plane: Plane,
  home: Home,
  grad: GraduationCap,
  car: CarFront,
  heart: Heart,
  briefcase: Briefcase,
  target: TargetIcon,
  book: BookOpen,
  piggy: PiggyBank,
};

export const isHexColor = (val: string) => val?.startsWith("#");

export const colorClassMap: Record<string, { bg: string; text: string }> = {
  emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  red: { bg: "bg-red-100", text: "text-red-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
  pink: { bg: "bg-pink-100", text: "text-pink-600" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
  green: { bg: "bg-green-100", text: "text-green-600" },
  orange: { bg: "bg-orange-100", text: "text-orange-600" },
  teal: { bg: "bg-teal-100", text: "text-teal-600" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-600" },
};

export const colorProgressMap: Record<string, string> = {
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  red: "bg-red-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  teal: "bg-teal-500",
  indigo: "bg-indigo-500",
};

export const getProgressPercentage = (
  current: number,
  target: number,
  boostRate?: number
): number => {
  const baseProgress = (current / target) * 100;
  const boost = Math.min(boostRate || 0, 0.05);
  return Math.min(baseProgress * (1 + boost), 110);
};
