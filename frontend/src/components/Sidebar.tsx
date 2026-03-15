import { Link, useLocation } from "react-router-dom";
import { CarFront, CircleUserRound, LayoutDashboard, LogOut, PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const items = [
  { to: "/rides", label: "Search rides", icon: Search },
  { to: "/create-ride", label: "Create ride", icon: PlusCircle },
  { to: "/dashboard", label: "My trips", icon: LayoutDashboard },
  { to: "/profile", label: "Profile", icon: CircleUserRound },
];

export function Sidebar() {
  const location = useLocation();
  const { logoutUser } = useAuth();

  return (
    <UISidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link to="/dashboard" className="flex items-center gap-2 text-xl font-semibold text-foreground">
          <CarFront className="h-6 w-6 text-primary" />
          <span className="truncate">Covoiturage</span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="p-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              location.pathname === item.to ||
              (item.to !== "/dashboard" && location.pathname.startsWith(`${item.to}/`));

            return (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton render={<Link to={item.to} />} isActive={isActive} tooltip={item.label}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <Button 
          className="w-full justify-start gap-2" 
          variant="ghost" 
          onClick={() => void logoutUser()}
        >
          <LogOut className="h-4 w-4 text-muted-foreground" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </UISidebar>
  );
}