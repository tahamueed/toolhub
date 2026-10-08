import { Braces, Type, ArrowLeftRight, Calculator, ImageIcon, FileText, GraduationCap, PenTool } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CategoryId } from "@/lib/categories";

const icons: Record<CategoryId, LucideIcon> = {
  developer: Braces,
  text: Type,
  writing: PenTool,
  converter: ArrowLeftRight,
  calculator: Calculator,
  image: ImageIcon,
  document: FileText,
  study: GraduationCap,
};

/** Renders the icon for a category directly, so callers never hold a
 * component reference in a render-time variable. */
export function CategoryIcon({ id, className }: { id: CategoryId; className?: string }) {
  const Icon = icons[id];
  return <Icon className={className} />;
}
