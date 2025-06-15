"use client"

import { useForm, Controller, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { PageTitle } from "@/components/shared/PageTitle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Save, XCircle, PlusCircle, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const checklistItemSchema = z.object({
  name: z.string().min(3, "Item name must be at least 3 characters"),
  description: z.string().optional(),
  isRequired: z.boolean().default(true),
})

const templateFormSchema = z.object({
  name: z.string().min(3, "Template name must be at least 3 characters"),
  department: z.string().min(1, "Department is required"),
  interval: z.enum(["weekly", "bi-weekly", "monthly", "quarterly", "bi-annually", "annually"]),
  bufferDays: z.number().min(1, "Buffer days must be at least 1").max(90, "Buffer days cannot exceed 90"),
  description: z.string().optional(),
  items: z.array(checklistItemSchema).min(1, "At least one checklist item is required"),
})

type TemplateFormData = z.infer<typeof templateFormSchema>

const DEPARTMENTS = [
  "Safety & Security",
  "Fleet Management",
  "Maintenance",
  "Facilities",
  "Rugvænget",
  "Parkvej",
  "Teglstenen",
  "Community Services",
]

const INTERVALS = [
  { value: "weekly", label: "Weekly", description: "Every 7 days" },
  { value: "bi-weekly", label: "Bi-weekly", description: "Every 14 days" },
  { value: "monthly", label: "Monthly", description: "Every 30 days" },
  { value: "quarterly", label: "Quarterly", description: "Every 90 days" },
  { value: "bi-annually", label: "Bi-annually", description: "Every 180 days" },
  { value: "annually", label: "Annually", description: "Every 365 days" },
]

export default function AddTemplatePage() {
  const router = useRouter()
  const { toast } = useToast()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      department: "",
      interval: "monthly",
      bufferDays: 7,
      description: "",
      items: [{ name: "", description: "", isRequired: true }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  })

  const selectedInterval = watch("interval")
  const bufferDays = watch("bufferDays")

  const onSubmit = async (data: TemplateFormData) => {
    try {
      console.log("Creating template:", data)

      // Mock successful creation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Template Created Successfully",
        description: `${data.name} has been added with ${data.items.length} checklist items.`,
      })

      router.push("/admin/templates")
    } catch (error: any) {
      console.error("Failed to create template:", error)
      toast({
        title: "Error",
        description: "Failed to create template. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addChecklistItem = () => {
    append({ name: "", description: "", isRequired: true })
  }

  const removeChecklistItem = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  return (
    <>
      <PageTitle
        title="Create Inspection Template"
        icon={FileText}
        description="Define a new inspection template with intervals and checklist items."
      />
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Template Configuration</CardTitle>
          <CardDescription>
            Set up the inspection template with its schedule, buffer days, and checklist items.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name*</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input id="templateName" placeholder="e.g., Fire Extinguisher Inspection" {...field} />
                  )}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department*</Label>
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.department && <p className="text-sm text-destructive">{errors.department.message}</p>}
              </div>
            </div>

            {/* Schedule Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="interval">Inspection Interval*</Label>
                <Controller
                  name="interval"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="interval">
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        {INTERVALS.map((interval) => (
                          <SelectItem key={interval.value} value={interval.value}>
                            <div>
                              <div className="font-medium">{interval.label}</div>
                              <div className="text-xs text-muted-foreground">{interval.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.interval && <p className="text-sm text-destructive">{errors.interval.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bufferDays" className="flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Buffer Days*
                </Label>
                <Controller
                  name="bufferDays"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="bufferDays"
                      type="number"
                      min="1"
                      max="90"
                      placeholder="7"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Inspections will turn orange {bufferDays} days before due date
                </p>
                {errors.bufferDays && <p className="text-sm text-destructive">{errors.bufferDays.message}</p>}
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
                    placeholder="Brief description of this inspection template..."
                    className="min-h-[80px]"
                    {...field}
                  />
                )}
              />
            </div>

            {/* Checklist Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Checklist Items</h3>
                  <p className="text-sm text-muted-foreground">
                    Define the items that need to be checked during inspection
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={addChecklistItem}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeChecklistItem(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.name`}>Item Name*</Label>
                        <Controller
                          name={`items.${index}.name`}
                          control={control}
                          render={({ field }) => (
                            <Input id={`items.${index}.name`} placeholder="e.g., Check pressure gauge" {...field} />
                          )}
                        />
                        {errors.items?.[index]?.name && (
                          <p className="text-sm text-destructive">{errors.items[index]?.name?.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.description`}>Description (Optional)</Label>
                        <Controller
                          name={`items.${index}.description`}
                          control={control}
                          render={({ field }) => (
                            <Input id={`items.${index}.description`} placeholder="Additional details..." {...field} />
                          )}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {errors.items && <p className="text-sm text-destructive">{errors.items.message}</p>}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Link href="/admin/templates">
              <Button variant="outline" type="button" disabled={isSubmitting}>
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create Template"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  )
}
