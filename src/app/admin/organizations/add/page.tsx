"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { PageTitle } from "@/components/shared/PageTitle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building, Mail, Phone, MapPin, Save, XCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const organizationFormSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().optional(),
  description: z.string().optional(),
})

type OrganizationFormData = z.infer<typeof organizationFormSchema>

export default function AddOrganizationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: "",
      address: "",
      contactEmail: "",
      contactPhone: "",
      description: "",
    },
  })

  const onSubmit = async (data: OrganizationFormData) => {
    try {
      // Simulate API call
      console.log("Creating organization:", data)

      // Mock successful creation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Organization Created Successfully",
        description: `${data.name} has been added to the system.`,
      })

      router.push("/admin/organizations")
    } catch (error: any) {
      console.error("Failed to create organization:", error)
      toast({
        title: "Error",
        description: "Failed to create organization. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <PageTitle
        title="Add New Organization"
        icon={Building}
        description="Create a new organization in the inspection system."
      />
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Organization Information</CardTitle>
          <CardDescription>
            Enter the details for the new organization. This will create the organizational structure for departments
            and users.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="orgName" className="flex items-center">
                <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                Organization Name*
              </Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input id="orgName" placeholder="e.g., Region Holbæk" {...field} />}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="orgAddress" className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                Address*
              </Label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="orgAddress"
                    placeholder="e.g., Smedelundsgade 60, 4300 Holbæk"
                    className="min-h-[80px]"
                    {...field}
                  />
                )}
              />
              {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  Contact Email*
                </Label>
                <Controller
                  name="contactEmail"
                  control={control}
                  render={({ field }) => (
                    <Input id="contactEmail" type="email" placeholder="admin@organization.com" {...field} />
                  )}
                />
                {errors.contactEmail && <p className="text-sm text-destructive">{errors.contactEmail.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone" className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  Contact Phone (Optional)
                </Label>
                <Controller
                  name="contactPhone"
                  control={control}
                  render={({ field }) => <Input id="contactPhone" placeholder="+45 12 34 56 78" {...field} />}
                />
                {errors.contactPhone && <p className="text-sm text-destructive">{errors.contactPhone.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    placeholder="Brief description of the organization..."
                    className="min-h-[100px]"
                    {...field}
                  />
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link href="/admin/organizations">
              <Button variant="outline" type="button" disabled={isSubmitting}>
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create Organization"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  )
}
