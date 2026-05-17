import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

type NavigationPillsProps = {
  items: {
    label: string;
    href: string;
  }[];
};

export function NavigationPills({ items }: NavigationPillsProps) {
  const [location] = useLocation();

  return (
    <div className="md:hidden navigation-pills flex justify-between mb-6 overflow-x-auto p-1 bg-white rounded-full shadow-sm">
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          <a
            className={cn(
              "flex-1 py-2 px-3 text-center rounded-full text-sm font-medium whitespace-nowrap",
              location === item.href ? "active" : "inactive"
            )}
          >
            {item.label}
          </a>
        </Link>
      ))}
    </div>
  );
}
