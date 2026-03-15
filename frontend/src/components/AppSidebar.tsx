import { CarFront, CircleUserRound, LayoutDashboard, PlusCircle, Search } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavUser } from './nav-user';
import { Link, useLocation } from 'react-router-dom';
import { User } from '@/types';

interface AppSidebarProps {
  user: User;
}

const items = [
  { title: 'Search rides', path: '/rides', icon: Search },
  { title: 'Create ride', path: '/create-ride', icon: PlusCircle },
  { title: 'My trips', path: '/dashboard', icon: LayoutDashboard },
  { title: 'Profile', path: '/profile', icon: CircleUserRound },
];

export function AppSidebar({ user }: AppSidebarProps) {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      {/* HEADER */}
      <SidebarHeader className="py-4 px-0 group-data-[collapsible=icon]:px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="rounded-none px-4 w-full hover:bg-sidebar-accent group-data-[collapsible=icon]:!p-0"
              render={
                <Link to="/dashboard" className="flex items-center gap-2 w-full h-full group-data-[collapsible=icon]:justify-center">
                  <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md shrink-0">
                    <CarFront className="size-6" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none overflow-hidden group-data-[collapsible=icon]:hidden">
                    <span className="font-medium truncate">Covoiturage</span>
                    <span className="text-xs truncate">v1.0.0</span>
                  </div>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* MAIN CONTENT */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.title} className="w-full">
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      render={
                        <Link to={item.path} className="flex items-center gap-2 w-full h-full group-data-[collapsible=icon]:justify-center">
                          <item.icon className="size-4 shrink-0" />
                          <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="p-0 w-full group-data-[collapsible=icon]:p-2">
        <NavUser user={{
          name: user.name,
          email: user.email,
          avatar: user.profile_picture || undefined
        }} />
      </SidebarFooter>
    </Sidebar>
  );
}
