"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { PageTitle } from "@/components/shared/PageTitle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Building, PlusCircle, Eye, Users, ClipboardList, ArrowLeft } from "lucide-react"

interface Department {
  id: number
  name: string
  areaId: number
  areaName: string
  userCount: number
  templateCount: number
  activeInspections: number
  isActive: boolean
  inspectionTypes: string[]
}

export default function AreaDepartmentsPage({ params }: { params: { areaId: string } }) {
  const [departments, setDepartments] = useState<Department[]>([])
  const [areaName, setAreaName] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true)
      try {
        // Mock data based on the specification
        const areaId = Number.parseInt(params.areaId)
        let mockDepartments: Department[] = []
        let currentAreaName = ""

        if (areaId === 5) {
          // Taastrup 061
          currentAreaName = "Taastrup 061"
          mockDepartments = [
            {
              id: 1,
              name: "Rugvænget",
              areaId: 5,
              areaName: "Taastrup 061",
              userCount: 4,
              templateCount: 2,
              activeInspections: 3,
              isActive: true,
              inspectionTypes: ["Fire Extinguishers", "Community Room"],
            },
            {
              id: 2,
              name: "Parkvej",
              areaId: 5,
              areaName: "Taastrup 061",
              userCount: 6,
              templateCount: 6,
              activeInspections: 8,
              isActive: true,
              inspectionTypes: [
                "Fire Extinguishers",
                "Playgrounds",
                "Dry Risers",
                "Community Room",
                "Vehicles",
                "Power Tools",
              ],
            },
            {
              id: 3,
              name: "Teglstenen",
              areaId: 5,
              areaName: "Taastrup 061",
              userCount: 3,
              templateCount: 1,
              activeInspections: 2,
              isActive: true,
              inspectionTypes: ["Vehicles"],
            },
            {
              id: 4,
              name: "Pælestykket",
              areaId: 5,
              areaName: "Taastrup 061",
              userCount: 2,
              templateCount: 1,
              activeInspections: 1,
              isActive: true,
              inspectionTypes: ["Community Room"],
            },
          ]
        } else {
          // Default departments for other areas
          currentAreaName = `Area ${areaId}`
          mockDepartments = [
            {
              id: 10 + areaId,
              name: "General Department",
              areaId: areaId,
              areaName: currentAreaName,
              userCount: 5,
              templateCount: 3,
              activeInspections: 4,
              isActive: true,
              inspectionTypes: ["Fire Extinguishers", "Community Room"],
            },
          ]
        }

        setAreaName(currentAreaName)
        setDepartments(mockDepartments)
      } catch (err: any) {
        console.error("Error fetching departments:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDepartments()
  }, [params.areaId])

  return (
    <>
      <PageTitle
        title={`Departments in ${areaName}`}
        icon={Building}
        description="Manage departments within this area and their inspection types."
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin/areas">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Areas
              </Button>
            </Link>
            <Link href={`/admin/areas/${params.areaId}/departments/add`}>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Department
              </Button>
            </Link>
          </div>
        }
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Departments in {areaName}</CardTitle>
          <CardDescription>
            Each department has specific inspection types with different frequencies and requirements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead>Inspection Types</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Templates</TableHead>
                <TableHead>Active Inspections</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{dept.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {dept.inspectionTypes.slice(0, 3).map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                      {dept.inspectionTypes.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{dept.inspectionTypes.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      {dept.userCount}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="gap-1">
                      <ClipboardList className="h-3 w-3" />
                      {dept.templateCount}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className="gap-1">
                      {dept.activeInspections} active
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={dept.isActive ? "default" : "secondary"}>
                      {dept.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/departments/${dept.id}`}>
                      <Button variant="ghost" size="icon" title="View Department">
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
