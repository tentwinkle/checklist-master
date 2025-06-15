export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "SUPERADMIN" | "ADMIN" | "INSPECTOR" | "USER"
  organizationId: number
  departmentId?: number
  isActive: boolean
  mustChangePassword?: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface Organization {
  id: number
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Area {
  id: number
  name: string
  organizationId: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Department {
  id: number
  name: string
  areaId: number
  organizationId: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface MasterControl {
  id: string
  name: string
  departmentId: number
  inspectionType: string
  interval: "weekly" | "bi-weekly" | "monthly" | "bi-monthly" | "quarterly" | "bi-annually" | "annually" | "bi-annually"
  bufferDays: number
  isActive: boolean
  items: MasterControlItem[]
  createdAt: string
  updatedAt: string
}

export interface MasterControlItem {
  id: string
  masterControlId: string
  itemName: string
  location: string
  qrCode: string
  priority: "low" | "medium" | "high"
  instructions?: string
  order: number
}

export interface InspectionInstance {
  id: string
  masterControlId: string
  inspectorId: string
  assetId?: string
  startedAt: string
  dueDate: string
  completedAt?: string
  isFinalized: boolean
  status: "In Progress" | "Completed" | "Overdue"
  items: InspectionInstanceItem[]
}

export interface InspectionInstanceItem {
  id: string
  instanceId: string
  masterItemId: string
  itemName: string
  location: string
  status?: "Approved" | "Not Approved"
  notes?: string
  photoUrls?: string[]
  priority: "low" | "medium" | "high"
  completedAt?: string
}

export interface InspectionReport {
  id: string
  inspectorId: string
  inspectorName: string
  templateId: string
  templateName: string
  assetId?: string
  assetName: string
  location: string
  department: string
  inspectionDate: string
  dueDate: string
  completedDate?: string
  isFinalized: boolean
  isLocked: boolean
  overallStatus: "In Progress" | "Completed" | "Overdue"
  overallResult: "Approved" | "Not Approved" | "Partial"
  hasFollowUp: boolean
  followUpDate?: string
  followUpNotes?: string
  items: InspectionReportItem[]
  pdfUrl?: string
  createdAt?: string
}

export interface InspectionReportItem {
  itemId: string
  itemName: string
  status: "Approved" | "Not Approved"
  notes?: string
  photoUrls?: string[]
  priority?: "low" | "medium" | "high"
  completedAt?: string
}

export interface FollowUp {
  id: string
  reportId: string
  followUpDate: string
  notes: string
  isResolved: boolean
  resolvedAt?: string
  resolvedBy?: string
  createdAt: string
}

export interface QRCodeItem {
  qrCode: string
  itemName: string
  location: string
  departmentId: number
  masterControlId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Navigation types
export interface NavItem {
  href: string
  label: string
  iconName: string
  roles: UserRole[]
  badge?: string | number
  group?: string
  subItems?: NavItem[]
}

// Form types
export interface CreateUserForm {
  firstName: string
  lastName: string
  email: string
  role: "ADMIN" | "INSPECTOR" | "USER"
  departmentId?: number
  sendInvite: boolean
}

export interface CreateOrganizationForm {
  name: string
  adminFirstName: string
  adminLastName: string
  adminEmail: string
}

export interface CreateMasterControlForm {
  name: string
  departmentId: number
  inspectionType: string
  interval: string
  bufferDays: number
  items: {
    itemName: string
    location: string
    priority: "low" | "medium" | "high"
    instructions?: string
  }[]
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Status types
export type InspectionStatus = "Due" | "Upcoming" | "Overdue" | "Completed"
export type UserRole = "SUPERADMIN" | "ADMIN" | "INSPECTOR" | "USER"
export type InspectionInterval =
  | "weekly"
  | "bi-weekly"
  | "monthly"
  | "bi-monthly"
  | "quarterly"
  | "bi-annually"
  | "annually"
export type Priority = "low" | "medium" | "high"
export type ApprovalStatus = "Approved" | "Not Approved"
