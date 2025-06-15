
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Building,
  ClipboardList,
  ScanLine,
  FileText, // Ensure FileText is imported
  Settings,
  HardHat,
  ShieldCheck,
  FolderArchive,
  Briefcase,
  LogOut, 
  Users2 // Ensure Users2 is imported
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Logo } from "./Logo";
import type { UserRole } from "@/types";
import type { NavItemConfig, iconMap as globalIconMap } from "@/config/nav";

// Map of icon names to actual Lucide components, must be defined in the Client Component
const iconComponentMap: Record<keyof typeof globalIconMap, LucideIcon> = {
  LayoutDashboard,
  Users,
  Building,
  ClipboardList,
  ScanLine,
  FileText, // Add FileText mapping
  Settings,
  HardHat,
  ShieldCheck,
  FolderArchive,
  Briefcase,
  Users2, // Add Users2 mapping
};

// Internal NavItem type for processing within this client component
// It directly uses NavItemConfig's structure which should now have iconName
interface NavItem extends NavItemConfig {
  iconName: keyof typeof iconComponentMap; // Ensure iconName is expected
  subItems?: NavItem[]; // Recursive definition for subItems
}

interface AppSidebarProps {
  navItems: NavItemConfig[]; // Consumes NavItemConfig from props
  currentRole: UserRole; 
}

const renderIcon = (iconName?: keyof typeof iconComponentMap) => {
  if (!iconName) return null;
  const IconComponent = iconComponentMap[iconName];
  return IconComponent ? <IconComponent /> : null;
};

export function AppSidebar({ navItems, currentRole }: AppSidebarProps) {
  const pathname = usePathname();

  // Filter navItems based on role. The items are already NavItemConfig.
  // Cast to internal NavItem type for convenience if needed, but structure should match.
  const filteredNavItems = navItems.filter(item => item.roles.includes(currentRole)) as NavItem[]; 
  
  const groupedItems: Record<string, NavItem[]> = {};
  const ungroupedItems: NavItem[] = [];

  filteredNavItems.forEach(item => {
    if (item.group) {
      if (!groupedItems[item.group]) {
        groupedItems[item.group] = [];
      }
      groupedItems[item.group].push(item);
    } else {
      ungroupedItems.push(item);
    }
  });


  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader>
        {/* Display Logo in the Sidebar Header */}
        <div className="group-data-[state=expanded]:block hidden p-1"> {/* Adjust padding as needed, ensure it shows when expanded */}
          <Logo size="md" />
        </div>
        <div className="group-data-[state=collapsed]:block hidden p-1"> {/* Smaller icon or just icon when collapsed */}
          <Link href="/" className="flex items-center justify-center text-primary">
            <Building className="h-6 w-6" />
          </Link>
        </div>
      </SidebarHeader>
      <ScrollArea className="flex-1">
        <SidebarContent className="p-2">
          {ungroupedItems.length > 0 && (
            <SidebarMenu>
              {ungroupedItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || pathname.startsWith(item.href + '/') || (item.subItems && item.subItems.some(sub => pathname.startsWith(sub.href)))}
                    tooltip={{ children: item.label, side:"right", align:"center" }}
                  >
                    <Link href={item.href}>
                      {renderIcon(item.iconName)}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.subItems && (
                     <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.href}>
                          <SidebarMenuSubButton asChild isActive={pathname === subItem.href || pathname.startsWith(subItem.href + '/')}>
                            <Link href={subItem.href}>
                              {renderIcon(subItem.iconName)}
                              <span>{subItem.label}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          )}

          {Object.entries(groupedItems).map(([groupName, items]) => (
            <SidebarGroup key={groupName}>
              <SidebarGroupLabel>{groupName}</SidebarGroupLabel>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
                      tooltip={{ children: item.label, side:"right", align:"center" }}
                    >
                      <Link href={item.href}>
                        {renderIcon(item.iconName)}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </ScrollArea>
      <Separator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={{ children: "Profile Settings", side:"right", align:"center" }} isActive={pathname === '/profile'}>
              <Link href="/profile">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={{ children: "Log Out", side:"right", align:"center" }}>
              <Link href="/login"> 
                <LogOut />
                <span>Log out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
