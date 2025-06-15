
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Users, Building, ClipboardList, ScanLine, FileText, Settings, HardHat, ShieldCheck, FolderArchive, Users2 } from "lucide-react"; 
import type { UserRole } from "@/types";

export const iconMap = {
  LayoutDashboard,
  Users, 
  Building, 
  ClipboardList, 
  ScanLine,
  FileText, 
  Settings,
  HardHat,
  ShieldCheck,
  FolderArchive, 
  Users2, 
};

export interface NavItemConfig {
  href: string;
  label: string;
  iconName: keyof typeof iconMap;
  roles: UserRole[];
  group?: string;
  subItems?: NavItemConfig[];
}

export const navConfig: NavItemConfig[] = [
  // Super Admin
  { href: "/superadmin/dashboard", label: "Dashboard", iconName: "LayoutDashboard", roles: ['SUPERADMIN'] },

  // Organization Admin
  { href: "/admin/dashboard", label: "Dashboard", iconName: "LayoutDashboard", roles: ['ADMIN'] },
  { href: "/admin/users", label: "Manage Users", iconName: "Users", roles: ['ADMIN'] },
  { href: "/admin/clients", label: "Manage Clients", iconName: "Users2", roles: ['ADMIN'] },
  { href: "/admin/forms", label: "Forms", iconName: "FileText", roles: ['ADMIN'] },

  // Inspector
  { href: "/inspector/dashboard", label: "Dashboard", iconName: "LayoutDashboard", roles: ['INSPECTOR'] },
  { href: "/inspector/scan", label: "Scan QR", iconName: "ScanLine", roles: ['INSPECTOR'] },
  { href: "/inspector/my-inspections", label: "My Inspections", iconName: "ShieldCheck", roles: ['INSPECTOR'] },

  // User
  { href: "/user/dashboard", label: "Dashboard", iconName: "LayoutDashboard", roles: ['USER'] },
  { href: "/user/forms", label: "Forms", iconName: "FileText", roles: ['USER'] },
];

