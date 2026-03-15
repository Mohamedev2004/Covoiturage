import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useTheme } from "@/components/theme-provider";
import { SidebarTrigger } from "./ui/sidebar";

interface NavbarProps {
  breadcrumb?: React.ReactNode;
}

export const Navbar = ({ breadcrumb }: NavbarProps) => {
  const { setTheme } = useTheme();

  return (
    <nav className="w-full flex items-center justify-between px-4 py-3 bg-gray-200 dark:bg-[#171717] rounded-tl-xl rounded-tr-xl border-b border-sidebar">
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>

      {/* CENTER — Breadcrumbs */}
      <div className="flex-1 flex justify-start px-2">
        {breadcrumb && (
          <div className="flex items-center text-sm text-muted-foreground">
            {breadcrumb}
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* THEME DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size="icon" className="relative">
              <Sun className="h-[1.2rem] w-[1.2rem] transition-all dark:hidden" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] hidden dark:block transition-all" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};
