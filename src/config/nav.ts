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
} from "lucide-react"
import type { NavConfig } from "@/types"

export const navConfig: NavConfig = {
  superadmin: [
    {
      title: "Dashboard",
      href: "/superadmin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Organizations",
      href: "/superadmin/organizations",
      icon: Building,
    },
    {
      title: "System Settings",
      href: "/superadmin/settings",
      icon: Settings,
    },
  ],
  admin: [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Areas",
      href: "/admin/areas",
      icon: MapPin,
    },
    {
      title: "Departments",
      href: "/admin/departments",
      icon: Building,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Master Controls",
      href: "/admin/master-controls",
      icon: Layers,
    },
    {
      title: "Templates",
      href: "/admin/templates",
      icon: ClipboardList,
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: FileText,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
  ],
  inspector: [
    {
      title: "Dashboard",
      href: "/inspector/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Scan QR Code",
      href: "/inspector/scan",
      icon: ScanLine,
    },
    {
      title: "My Inspections",
      href: "/inspector/my-inspections",
      icon: CheckSquare,
    },
    {
      title: "Due Inspections",
      href: "/inspector/due-inspections",
      icon: AlertTriangle,
      badge: "3",
    },
  ],
  user: [
    {
      title: "Dashboard",
      href: "/user/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Forms",
      href: "/user/forms",
      icon: ClipboardList,
    },
  ],
}
