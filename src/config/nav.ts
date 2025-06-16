import {
  LayoutDashboard,
  Users,
  Building,
  ClipboardList,
  FileText,
  Settings,
  MapPin,
  ScanLine,
  CheckSquare,
  AlertTriangle,
  BarChart3,
  Layers,
  HardHat,
  ShieldCheck,
  FolderArchive,
  Briefcase,
  Users2,
} from "lucide-react"
import type { NavItem, UserRole } from "@/types"

export const iconMap = {
  LayoutDashboard,
  Users,
  Building,
  ClipboardList,
  FileText,
  Settings,
  MapPin,
  ScanLine,
  CheckSquare,
  AlertTriangle,
  BarChart3,
  Layers,
  HardHat,
  ShieldCheck,
  FolderArchive,
  Briefcase,
  Users2,
}

export interface NavItemConfig extends Omit<NavItem, "icon"> {
  iconName: keyof typeof iconMap
  roles: UserRole[]
  group?: string
  subItems?: NavItemConfig[]
}

export const navConfig: NavItemConfig[] = [
  // Super Admin
  {
    href: "/superadmin/dashboard",
    label: "Dashboard",
    iconName: "LayoutDashboard",
    roles: ["SUPERADMIN"],
  },
  {
    href: "/superadmin/organizations",
    label: "Organizations",
    iconName: "Building",
    roles: ["SUPERADMIN"],
  },
  {
    href: "/superadmin/settings",
    label: "System Settings",
    iconName: "Settings",
    roles: ["SUPERADMIN"],
  },

  // Organization Admin
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    iconName: "LayoutDashboard",
    roles: ["ADMIN"],
  },
  {
    href: "/admin/areas",
    label: "Areas",
    iconName: "MapPin",
    roles: ["ADMIN"],
  },
  {
    href: "/admin/departments",
    label: "Departments",
    iconName: "Building",
    roles: ["ADMIN"],
  },
  {
    href: "/admin/organizations",
    label: "Organizations",
    iconName: "Building",
    roles: ["ADMIN"],
  },
  {
    href: "/admin/users",
    label: "Users",
    iconName: "Users",
    roles: ["ADMIN"],
  },
  {
    href: "/admin/master-controls",
    label: "Master Controls",
    iconName: "Layers",
    roles: ["ADMIN"],
  },
  {
    href: "/admin/templates",
    label: "Templates",
    iconName: "ClipboardList",
    roles: ["ADMIN"],
  },
  {
    href: "/admin/reports",
    label: "Reports",
    iconName: "FileText",
    roles: ["ADMIN"],
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    iconName: "BarChart3",
    roles: ["ADMIN"],
  },

  // Inspector
  {
    href: "/inspector/dashboard",
    label: "Dashboard",
    iconName: "LayoutDashboard",
    roles: ["INSPECTOR"],
  },
  {
    href: "/inspector/scan",
    label: "Scan QR Code",
    iconName: "ScanLine",
    roles: ["INSPECTOR"],
  },
  {
    href: "/inspector/my-inspections",
    label: "My Inspections",
    iconName: "CheckSquare",
    roles: ["INSPECTOR"],
  },
  {
    href: "/inspector/due-inspections",
    label: "Due Inspections",
    iconName: "AlertTriangle",
    roles: ["INSPECTOR"],
    badge: "3",
  },

  // Regular User
  {
    href: "/user/dashboard",
    label: "Dashboard",
    iconName: "LayoutDashboard",
    roles: ["USER"],
  },
  {
    href: "/user/forms",
    label: "My Forms",
    iconName: "ClipboardList",
    roles: ["USER"],
  },
]
