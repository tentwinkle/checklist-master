"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { PageTitle } from "@/components/shared/PageTitle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Building, PlusCircle, Eye, MapPin, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Area {
  id: number
  name: string
  organizationId: number
  organizationName: string
  departmentCount: number
  userCount: number
  isActive: boolean
  createdAt: string
}

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAreas = async () => {
      setIsLoading(true)
      try {
        // Mock data for Region Holbæk areas
        const mockAreas: Area[] = [
          {
            id: 1,
            name: "Høng",
            organizationId: 1,
            organizationName: "Region Holbæk",
            departmentCount: 3,
            userCount: 8,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            name: "Kalundborg",
            organizationId: 1,
            organizationName: "Region Holbæk",
            departmentCount: 5,
            userCount: 12,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 3,
            name: "Holbæk Midtby",
            organizationId: 1,
            organizationName: "Region Holbæk",
            departmentCount: 4,
            userCount: 10,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 4,
            name: "Holbæk Vest",
            organizationId: 1,
            organizationName: "Region Holbæk",
            departmentCount: 2,
            userCount: 6,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 5,
            name: "Taastrup 061",
            organizationId: 1,
            organizationName: "Region Holbæk",
            departmentCount: 4,
            userCount: 15,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 6,
            name: "Taastrup 010",
            organizationId: 1,
            organizationName: "Region Holbæk",
            departmentCount: 3,
            userCount: 9,
            isActive: true,
            createdAt: new Date().toISOString(),
          },
        ]

        setAreas(mockAreas)
      } catch (err: any) {
        console.error("Error fetching areas:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAreas()
  }, [])

  const AreaRowSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton className="h-5 w-10" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-20 rounded-full" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-8 w-8 inline-block rounded-md" />
      </TableCell>
    </TableRow>
  )

  return (
    <>
      <PageTitle
        title="Manage Areas"
        icon={MapPin}
        description="Manage geographical areas within Region Holbæk organization."
        actions={
          <Link href="/admin/areas/add">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Area
            </Button>
          </Link>
        }
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Areas Overview</CardTitle>
          <CardDescription>
            Geographical areas containing multiple departments. Each area represents a specific location within Region
            Holbæk.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Area Name</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Departments</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => <AreaRowSkeleton key={`skeleton-${index}`} />)
              ) : areas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <MapPin className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No areas found.</p>
                      <Link href="/admin/areas/add" className="mt-2">
                        <Button variant="outline">Add First Area</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                areas.map((area) => (
                  <TableRow key={area.id}>
                    <TableCell>{area.id}</TableCell>
                    <TableCell className="font-medium">{area.name}</TableCell>
                    <TableCell>{area.organizationName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        <Building className="h-3 w-3" />
                        {area.departmentCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        <Users className="h-3 w-3" />
                        {area.userCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={area.isActive ? "default" : "secondary"}>
                        {area.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/areas/${area.id}`}>
                        <Button variant="ghost" size="icon" title="View Area Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
