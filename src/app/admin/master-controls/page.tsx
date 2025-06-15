"use client"

import { useState } from "react"
import { PageTitle } from "@/components/shared/PageTitle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardList, Search, PlusCircle, Eye, QrCode, Calendar, MapPin, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface MasterControl {
  id: string
  name: string
  department: string
  area: string
  inspectionType: string
  itemCount: number
  interval: string
  bufferDays: number
  nextDue: string
  status: "Active" | "Draft" | "Inactive"
  lastUpdated: string
  frequency: string
}

const MOCK_MASTER_CONTROLS: MasterControl[] = [
  {
    id: "MC-001",
    name: "Fire Extinguishers - Rugvænget",
    department: "Rugvænget",
    area: "Taastrup 061",
    inspectionType: "Fire Extinguishers",
    itemCount: 35,
    interval: "bi-annually",
    bufferDays: 16,
    nextDue: "2024-07-15",
    status: "Active",
    lastUpdated: "2024-01-15",
    frequency: "Every 6 months",
  },
  {
    id: "MC-002",
    name: "Community Room - Rugvænget",
    department: "Rugvænget",
    area: "Taastrup 061",
    inspectionType: "Community Room",
    itemCount: 12,
    interval: "annually",
    bufferDays: 30,
    nextDue: "2024-12-01",
    status: "Active",
    lastUpdated: "2024-01-10",
    frequency: "Once a year",
  },
  {
    id: "MC-003",
    name: "Playgrounds - Parkvej",
    department: "Parkvej",
    area: "Taastrup 061",
    inspectionType: "Playgrounds",
    itemCount: 8,
    interval: "annually",
    bufferDays: 30,
    nextDue: "2024-05-20",
    status: "Active",
    lastUpdated: "2024-01-08",
    frequency: "Once a year",
  },
  {
    id: "MC-004",
    name: "Power Tools - Parkvej",
    department: "Parkvej",
    area: "Taastrup 061",
    inspectionType: "Power Tools",
    itemCount: 24,
    interval: "quarterly",
    bufferDays: 14,
    nextDue: "2024-04-01",
    status: "Active",
    lastUpdated: "2024-01-05",
    frequency: "Every 4 months",
  },
  {
    id: "MC-005",
    name: "Vehicles - Teglstenen",
    department: "Teglstenen",
    area: "Taastrup 061",
    inspectionType: "Vehicles",
    itemCount: 6,
    interval: "annually",
    bufferDays: 30,
    nextDue: "2024-08-15",
    status: "Active",
    lastUpdated: "2024-01-03",
    frequency: "Once a year",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "default"
    case "Draft":
      return "secondary"
    case "Inactive":
      return "outline"
    default:
      return "secondary"
  }
}

const getIntervalColor = (interval: string) => {
  switch (interval) {
    case "weekly":
      return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400"
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

export default function MasterControlsPage() {
  const [masterControls, setMasterControls] = useState<MasterControl[]>(MOCK_MASTER_CONTROLS)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")

  const filteredControls = masterControls.filter((control) => {
    const matchesSearch =
      control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.inspectionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = departmentFilter === "all" || control.department === departmentFilter

    return matchesSearch && matchesDepartment
  })

  const departments = Array.from(new Set(masterControls.map((c) => c.department)))

  return (
    <>
      <PageTitle
        title="Master Controls"
        icon={ClipboardList}
        description="Manage inspection templates and master controls for all departments."
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search controls..."
                className="pl-8 w-48 md:w-64 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
            <Link href="/admin/master-controls/add">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Master Control
              </Button>
            </Link>
          </div>
        }
      />

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Controls</p>
                <p className="text-2xl font-bold">{masterControls.length}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Controls</p>
                <p className="text-2xl font-bold">{masterControls.filter((c) => c.status === "Active").length}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{masterControls.reduce((acc, c) => acc + c.itemCount, 0)}</p>
              </div>
              <QrCode className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Departments</p>
                <p className="text-2xl font-bold">{departments.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Master Control Templates</CardTitle>
          <CardDescription>
            Master controls define inspection templates with items, locations, and frequencies. Changes to master
            controls only affect future inspections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Control ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Buffer Days</TableHead>
                <TableHead>Next Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredControls.map((control) => (
                <TableRow key={control.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-mono text-sm">{control.id}</TableCell>
                  <TableCell className="font-medium">{control.name}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{control.department}</div>
                      <div className="text-sm text-muted-foreground">{control.area}</div>
                    </div>
                  </TableCell>
                  <TableCell>{control.inspectionType}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{control.itemCount} items</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getIntervalColor(control.interval)}>{control.frequency}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      {control.bufferDays} days
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{new Date(control.nextDue).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(control.status)}>{control.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/master-controls/${control.id}`}>
                      <Button variant="ghost" size="icon" title="View/Edit Master Control">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
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
