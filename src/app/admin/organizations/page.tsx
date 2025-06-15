"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { PageTitle } from "@/components/shared/PageTitle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Building, PlusCircle, AlertTriangle, CheckCircle, XCircle, Eye, Layers, MapPin, Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Organization {
  id: number
  name: string
  address: string
  contactEmail: string
  contactPhone?: string
  isActive: boolean
  departmentCount: number
  userCount: number
  createdAt: string
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrganizations = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Mock data for demonstration
        const mockOrganizations: Organization[] = [
          {
            id: 1,
            name: "Region Holbæk",
            address: "Smedelundsgade 60, 4300 Holbæk",
            contactEmail: "admin@regionholbaek.dk",
            contactPhone: "+45 59 48 40 00",
            isActive: true,
            departmentCount: 8,
            userCount: 24,
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            name: "Rugvænget Afdeling",
            address: "Rugvænget 12, 4300 Holbæk",
            contactEmail: "rugvaenget@regionholbaek.dk",
            contactPhone: "+45 59 48 41 00",
            isActive: true,
            departmentCount: 3,
            userCount: 8,
            createdAt: new Date().toISOString(),
          },
          {
            id: 3,
            name: "Parkvej Facility",
            address: "Parkvej 45, 4300 Holbæk",
            contactEmail: "parkvej@regionholbaek.dk",
            isActive: false,
            departmentCount: 2,
            userCount: 5,
            createdAt: new Date().toISOString(),
          },
        ]

        setOrganizations(mockOrganizations)
      } catch (err: any) {
        console.error("Error fetching organizations:", err)
        setError(err.message || "An unknown error occurred while fetching organizations.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrganizations()
  }, [])

  const OrganizationRowSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton className="h-5 w-10" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-48" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-40" />
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
        title="Manage Organizations"
        icon={Building}
        description="Create and manage organizations within the inspection system."
        actions={
          <Link href="/admin/organizations/add">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Organization
            </Button>
          </Link>
        }
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Organization List</CardTitle>
          <CardDescription>All organizations in the system with their departments and users.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="my-4 p-4 bg-destructive/10 border border-destructive/50 text-destructive rounded-md flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <p>
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Organization Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Contact Email</TableHead>
                <TableHead>Departments</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => <OrganizationRowSkeleton key={`skeleton-${index}`} />)
              ) : organizations.length === 0 && !error ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Layers className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No organizations found.</p>
                      <Link href="/admin/organizations/add" className="mt-2">
                        <Button variant="outline">Add First Organization</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                organizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>{org.id}</TableCell>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{org.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>{org.contactEmail}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        <Building className="h-3 w-3" />
                        {org.departmentCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        <Users className="h-3 w-3" />
                        {org.userCount}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {org.isActive ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="h-3 w-3" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/organizations/${org.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-primary"
                          title="View Organization Details"
                        >
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
