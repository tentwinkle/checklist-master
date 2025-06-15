
export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'INSPECTOR' | 'USER';

export type User = {
  id: number; 
  firebaseUid: string; 
  username: string;
  email: string;
  firstName: string; 
  lastName: string;  
  phone?: string | null;
  role: UserRole;
  isActive?: boolean | null;
};

export type Client = {
  id: number;
  clientName: string;
  email: string;
  companyName: string; // No longer optional
  phone?: string | null;
  createdAt: string; 
  firebaseUid: string; // Added back
};

export type ChecklistItemDef = {
  id: string;
  name: string;
  controlInterval: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'annually';
  bufferDays: number;
};

export type ChecklistTemplate = {
  id: string;
  name: string;
  items: ChecklistItemDef[];
  createdAt: string;
  updatedAt: string;
};

export type InspectedItemStatus = 'Approved' | 'Not Approved';
export type ReportItemStatus = 'Completed' | 'Upcoming' | 'Overdue'; // May rename to FormStatus

export type InspectionReportItem = { // May rename to FormItem
  itemId: string;
  itemName: string;
  status: InspectedItemStatus;
  notes?: string;
  photoUrls?: string[];
};

export type InspectionReport = { // May rename to Form
  id: string;
  inspectorId: string;
  inspectorName: string;
  checklistTemplateId: string; // May rename or adapt
  checklistName: string; // May rename
  inspectedAssetId?: string;
  inspectedAssetName?: string;
  inspectionDate: string; // Or submissionDate
  items: InspectionReportItem[];
  isFinalized: boolean;
  overallStatus: ReportItemStatus;
  followUpNotes?: string;
  followUpDate?: string;
};
