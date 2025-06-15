"use client"

import { useState, useEffect } from "react"
import { PageTitle } from "@/components/shared/PageTitle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Download,
  ArrowLeft,
  User,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
  AlertTriangle,
  Save,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import type { InspectionReport } from "@/types"

export default function ReportDetailPage({ params }: { params: { reportId: string } }) {
  const [report, setReport] = useState<InspectionReport | null>(null)
  const [followUpNote, setFollowUpNote] = useState("")
  const [followUpDate, setFollowUpDate] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true)
      try {
        // Mock detailed report data
        const mockReport: InspectionReport = {
          id: params.reportId,
          inspectorId: "inspector-001",
          inspectorName: "Lars Nielsen",
          templateId: "MC-001",
          templateName: "Fire Extinguisher Inspection - Rugvænget",
          assetId: "FE-102-RUG",
          assetName: "Fire Extinguisher FE-102",
          location: "Corridor A, Building 1 - Rugvænget",
          department: "Rugvænget",
          inspectionDate: "2024-01-15T10:30:00Z",
          dueDate: "2024-01-15",
          completedDate: "2024-01-15T14:45:00Z",
          isFinalized: true,
          isLocked: true,
          overallStatus: "Completed",
          overallResult: "Not Approved",
          hasFollowUp: true,
          followUpDate: "2024-01-22",
          followUpNotes: "Pressure gauge needs replacement. Maintenance scheduled.",
          items: [
            {
              itemId: "item1",
              itemName: "Check Pressure Gauge Reading",
              status: "Not Approved",
              notes: "Pressure gauge showing red zone (8 bar). Requires immediate attention.",
              photoUrls: ["photo1.jpg"],
              priority: "high",
            },
            {
              itemId: "item2",
              itemName: "Inspect Hose & Nozzle for Damage",
              status: "Approved",
              notes: "Hose and nozzle in good condition. No visible damage.",
              priority: "high",
            },
            {
              itemId: "item3",
              itemName: "Verify Accessibility and Clear Path",
              status: "Approved",
              notes: "Clear 1-meter radius maintained. Signage visible.",
              priority: "medium",
            },
            {
              itemId: "item4",
              itemName: "Check Service Tag and Expiry Date",
              status: "Approved",
              notes: "Service tag current. Next service due July 2024.",
              priority: "medium",
            },
            {
              itemId: "item5",
              itemName: "Inspect Mounting Bracket Security",
              status: "Approved",
              notes: "Bracket secure and properly mounted.",
              priority: "low",
            },
          ],
        }

        setReport(mockReport)
        setFollowUpNote(mockReport.followUpNotes || "")
        setFollowUpDate(mockReport.followUpDate || "")
      } catch (error) {
        console.error("Error fetching report:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReport()
  }, [params.reportId])

  const handleFollowUpSave = async () => {
    if (!report) return

    try {
      // Update follow-up information
      const updatedReport = {
        ...report,
        followUpNotes: followUpNote,
        followUpDate: followUpDate,
        hasFollowUp: followUpNote.trim() !== "" || followUpDate !== "",
      }

      setReport(updatedReport)

      toast({
        title: "Follow-up Updated",
        description: "Follow-up information has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow-up information.",
        variant: "destructive",
      })
    }
  }

  const exportToPDF = () => {
    if (!report) return

    console.log("Exporting report to PDF:", report.id)
    // PDF export logic would go here
    toast({
      title: "PDF Export",
      description: "Report is being prepared for download...",
    })
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Report Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested report could not be found.</p>
        <Link href="/admin/reports">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Reports
          </Button>
        </Link>
      </div>
    )
  }

  const approvedItems = report.items.filter((item) => item.status === "Approved").length
  const notApprovedItems = report.items.filter((item) => item.status === "Not Approved").length

  return (
    <>
      <PageTitle
        title={`Report: ${report.id}`}
        icon={FileText}
        description={report.templateName}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin/reports">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Reports
              </Button>
            </Link>
            <Button onClick={exportToPDF}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        }
      />

      {/* Report Header */}
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {report.isLocked && <Lock className="h-5 w-5 text-muted-foreground" />}
              {report.assetName}
            </CardTitle>
            <Badge variant={report.overallResult === "Approved" ? "default" : "destructive"}>
              {report.overallResult}
            </Badge>
          </div>
          <CardDescription>
            Inspection completed on {new Date(report.inspectionDate).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium">Inspector:</span>
                <div>{report.inspectorName}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium">Location:</span>
                <div>{report.location}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium">Due Date:</span>
                <div>{new Date(report.dueDate).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium">Completed:</span>
                <div>{report.completedDate ? new Date(report.completedDate).toLocaleString() : "N/A"}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{report.items.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedItems}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Not Approved</p>
                <p className="text-2xl font-bold text-red-600">{notApprovedItems}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inspection Items */}
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle>Inspection Items</CardTitle>
          <CardDescription>
            Detailed results for each inspection item. This report is locked and cannot be modified.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Photos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.items.map((item, index) => (
                <TableRow key={item.itemId}>
                  <TableCell className="font-medium">{item.itemName}</TableCell>
                  <TableCell>
                    {item.priority && (
                      <Badge className={getPriorityColor(item.priority)}>{item.priority.toUpperCase()}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === "Approved" ? "default" : "destructive"}>
                      {item.status === "Approved" ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : (
                        <XCircle className="mr-1 h-3 w-3" />
                      )}
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm">
                      {item.notes || <span className="text-muted-foreground italic">No notes</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.photoUrls && item.photoUrls.length > 0 ? (
                      <Badge variant="outline">{item.photoUrls.length} photo(s)</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Follow-up Section */}
      {notApprovedItems > 0 && (
        <Card className="shadow-lg border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <AlertTriangle className="h-5 w-5" />
              Follow-up Required
            </CardTitle>
            <CardDescription>
              This report contains {notApprovedItems} non-approved item(s) that require follow-up action.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="followUpDate">Follow-up Date</Label>
                <Input
                  id="followUpDate"
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="followUpNote">Follow-up Notes</Label>
                <Textarea
                  id="followUpNote"
                  placeholder="Describe the follow-up actions taken or planned..."
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleFollowUpSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Follow-up
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
