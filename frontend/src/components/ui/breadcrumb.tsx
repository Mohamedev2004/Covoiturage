import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumb({ children, className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-primary", className)}>
      {children}
    </nav>
  );
}

export function BreadcrumbItem({ children }: { children: React.ReactNode }) {
  return <span className="flex items-center">{children}</span>;
}

export function BreadcrumbSeparator() {
  return <ChevronRight className="mx-1 h-4 w-4 text-primary" />;
}

export function BreadcrumbLink({
  href,
  children,
  active,
}: {
  href?: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return href && !active ? (
    <a href={href} className="hover:text-primary transition-colors">
      {children}
    </a>
  ) : (
    <span className="text-primary">{children}</span>
  );
}
