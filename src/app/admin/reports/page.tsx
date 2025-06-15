"use client"

import { useState } from "react"
import { PageTitle } from "@/components/shared/PageTitle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search, Download, Eye, AlertTriangle, CheckCircle, Clock, User, Building } from "lucide-react"
import Link from "next/link"
import { StatusBadge } from "@/components/shared/StatusBadge"

interface InspectionReport {
  id: string
  inspectionName: string
  inspector: string
  department: string
  location: string
  completedDate: string
  dueDate: string
  status: "Completed" | "Upcoming" | "Overdue"
  overallResult: "Approved" | "Not Approved" | "Partial"
  itemsTotal: number
  itemsApproved: number
  hasFollowUp: boolean
  followUpDate?: string
  isLocked: boolean
}

const MOCK_REPORTS: InspectionReport[] = [
  {
    id: "RPT-001",
    inspectionName: "Fire Extinguisher FE-102",
    inspector: "Lars Nielsen",
    department: "Safety & Security",
    location: "Corridor A, Building 1",
    completedDate: "2024-01-15",
    dueDate: "2024-01-15",
    status: "Completed",
    overallResult: "Approved",
    itemsTotal: 8,
    itemsApproved: 8,
    hasFollowUp: false,
    isLocked: true,
  },
  {
    id: "RPT-002",
    inspectionName: "Vehicle Safety Check - VH-205",
    inspector: "Maria Andersen",
    department: "Fleet Management",
    location: "Parking Lot B",
    completedDate: "2024-01-14",
    dueDate: "2024-01-14",
    status: "Completed",
    overallResult: "Not Approved",
    itemsTotal: 12,
    itemsApproved: 9,
    hasFollowUp: true,
    followUpDate: "2024-01-21",
    isLocked: true,
  },
  {
    id: "RPT-003",
    inspectionName: "Power Tools Inspection",
    inspector: "Erik Hansen",
    department: "Maintenance",
    location: "Workshop C",
    completedDate: "2024-01-13",
    dueDate: "2024-01-10",
    status: "Overdue",
    overallResult: "Partial",
    itemsTotal: 6,
    itemsApproved: 4,
    hasFollowUp: true,
    followUpDate: "2024-01-20",
    isLocked: true,
  },
  {
    id: "RPT-004",
    inspectionName: "Community Room Check - Room 15",
    inspector: "Anna Sørensen",
    department: "Facilities",
    location: "Rugvænget Building",
    completedDate: "",
    dueDate: "2024-01-18",
    status: "Upcoming",
    overallResult: "Approved",
    itemsTotal: 15,
    itemsApproved: 0,
    hasFollowUp: false,
    isLocked: false,
  },
]

const getResultBadgeVariant = (result: string) => {
  switch (result) {
    case "Approved":
      return "default"
    case "Not Approved":
      return "destructive"
    case "Partial":
      return "secondary"
    default:
      return "outline"
  }
}

export default function ReportsPage() {
  const [reports, setReports] = useState<InspectionReport[]>(MOCK_REPORTS)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.inspectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.inspector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || report.department === departmentFilter

    return matchesSearch && matchesStatus && matchesDepartment
  })

  const departments = Array.from(new Set(reports.map((r) => r.department)))
  const completedReports = reports.filter((r) => r.status === "Completed").length
  const overdueReports = reports.filter((r) => r.status === "Overdue").length
  const followUpReports = reports.filter((r) => r.hasFollowUp).length

  const exportToPDF = (reportId: string) => {
    console.log(`Exporting report ${reportId} to PDF`)
    // PDF export logic would go here
  }

  return (
    <>
      <PageTitle
        title="Inspection Reports"
        icon={FileText}
        description="View, manage, and export completed inspection reports."
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="pl-8 w-48 md:w-64 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">{reports.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedReports}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueReports}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Need Follow-up</p>
                <p className="text-2xl font-bold text-orange-600">{followUpReports}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Reports Overview</CardTitle>
          <CardDescription>All inspection reports with their status and follow-up requirements.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Inspection</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Follow-up</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-mono text-sm">{report.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{report.inspectionName}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {report.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {report.inspector}
                    </div>
                  </TableCell>
                  <TableCell>{report.department}</TableCell>
                  <TableCell>
                    <StatusBadge status={report.status} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={getResultBadgeVariant(report.overallResult)}>{report.overallResult}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="font-medium text-green-600">{report.itemsApproved}</span>
                      <span className="text-muted-foreground">/{report.itemsTotal}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {report.hasFollowUp ? (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-orange-600">
                          {report.followUpDate ? new Date(report.followUpDate).toLocaleDateString() : "Required"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/reports/${report.id}`}>
                        <Button variant="ghost" size="icon" title="View Report">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {report.isLocked && (
                        <Button variant="ghost" size="icon" title="Export PDF" onClick={() => exportToPDF(report.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
