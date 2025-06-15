"use client"

import { useState } from "react"
import { PageTitle } from "@/components/shared/PageTitle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, FileText, FilterIcon, Search, Layers, PlusCircle, Calendar, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface InspectionTemplate {
  id: string
  name: string
  department: string
  interval: "weekly" | "bi-weekly" | "monthly" | "quarterly" | "bi-annually" | "annually"
  bufferDays: number
  itemCount: number
  isActive: boolean
  lastUpdated: string
}

const MOCK_TEMPLATES: InspectionTemplate[] = [
  {
    id: "fire-ext-001",
    name: "Fire Extinguisher Inspection",
    department: "Safety & Security",
    interval: "bi-annually",
    bufferDays: 16,
    itemCount: 8,
    isActive: true,
    lastUpdated: "2024-01-15",
  },
  {
    id: "vehicle-001",
    name: "Vehicle Safety Check",
    department: "Fleet Management",
    interval: "monthly",
    bufferDays: 7,
    itemCount: 12,
    isActive: true,
    lastUpdated: "2024-01-10",
  },
  {
    id: "power-tools-001",
    name: "Power Tools Inspection",
    department: "Maintenance",
    interval: "quarterly",
    bufferDays: 14,
    itemCount: 6,
    isActive: true,
    lastUpdated: "2024-01-08",
  },
  {
    id: "community-room-001",
    name: "Community Room Check",
    department: "Facilities",
    interval: "weekly",
    bufferDays: 3,
    itemCount: 15,
    isActive: false,
    lastUpdated: "2023-12-20",
  },
]

const getIntervalBadgeColor = (interval: string) => {
  switch (interval) {
    case "weekly":
      return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400"
    case "bi-weekly":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-400"
    case "monthly":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400"
    case "quarterly":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400"
    case "bi-annually":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-400"
    case "annually":
      return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400"
  }
}

export default function InspectionTemplatesPage() {
  const [templates, setTemplates] = useState<InspectionTemplate[]>(MOCK_TEMPLATES)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <PageTitle
        title="Inspection Templates"
        icon={FileText}
        description="Create and manage inspection templates with intervals and buffer days."
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search templates..."
                className="pl-8 w-48 md:w-64 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="shadow-sm" disabled>
              <FilterIcon className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Link href="/admin/templates/add">
              <Button className="shadow-sm">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Template
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Templates</p>
                <p className="text-2xl font-bold">{templates.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Templates</p>
                <p className="text-2xl font-bold">{templates.filter((t) => t.isActive).length}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Departments</p>
                <p className="text-2xl font-bold">{new Set(templates.map((t) => t.department)).size}</p>
              </div>
              <Layers className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Buffer Days</p>
                <p className="text-2xl font-bold">
                  {Math.round(templates.reduce((acc, t) => acc + t.bufferDays, 0) / templates.length)}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Template List</CardTitle>
          <CardDescription>Manage inspection templates, their intervals, and buffer day settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Interval</TableHead>
                <TableHead>Buffer Days</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <TableRow key={template.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>{template.department}</TableCell>
                    <TableCell>
                      <Badge className={getIntervalBadgeColor(template.interval)}>
                        {template.interval.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        {template.bufferDays} days
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{template.itemCount} items</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={template.isActive ? "default" : "secondary"}>
                        {template.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(template.lastUpdated).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/templates/${template.id}`}>
                        <Button variant="ghost" size="icon" className="hover:text-primary" title="View/Edit Template">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-36 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Layers className="h-12 w-12 text-muted-foreground mb-3" />
                      <p className="text-lg font-medium text-muted-foreground">No templates match your search.</p>
                      <p className="text-sm text-muted-foreground">
                        Try a different search term or create a new template.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
