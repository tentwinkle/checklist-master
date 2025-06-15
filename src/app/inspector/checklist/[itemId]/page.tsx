"use client"

import type React from "react"

import { useState } from "react"
import { PageTitle } from "@/components/shared/PageTitle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckSquare,
  XSquare,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  UploadCloud,
  ShieldCheck,
  Camera,
  MapPin,
  Calendar,
  User,
} from "lucide-react"
import { useRouter } from "next/navigation"
import type { ChecklistItemDef, InspectedItemStatus } from "@/types"

// Enhanced mock data with more realistic inspection details
const MOCK_ASSET_NAME = "Fire Extinguisher FE-102"
const MOCK_LOCATION = "Corridor A, Building 1 - Rugvænget"
const MOCK_INSPECTOR = "Lars Nielsen"
const MOCK_DUE_DATE = "2024-01-15"

const MOCK_CHECKLIST_ITEMS: (ChecklistItemDef & {
  currentValue?: InspectedItemStatus
  notes?: string
  photo?: File | null
  priority: "high" | "medium" | "low"
  instructions?: string
})[] = [
  {
    id: "item1",
    name: "Check Pressure Gauge Reading",
    controlInterval: "monthly",
    bufferDays: 7,
    currentValue: undefined,
    notes: "",
    photo: null,
    priority: "high",
    instructions: "Ensure pressure gauge shows green zone (12-15 bar). Red zone indicates recharge needed.",
  },
  {
    id: "item2",
    name: "Inspect Hose & Nozzle for Damage",
    controlInterval: "monthly",
    bufferDays: 7,
    currentValue: undefined,
    notes: "",
    photo: null,
    priority: "high",
    instructions: "Check for cracks, blockages, or corrosion. Hose should be flexible and nozzle clear.",
  },
  {
    id: "item3",
    name: "Verify Accessibility and Clear Path",
    controlInterval: "monthly",
    bufferDays: 7,
    currentValue: undefined,
    notes: "",
    photo: null,
    priority: "medium",
    instructions: "Ensure 1-meter clearance around extinguisher. Check visibility of signage.",
  },
  {
    id: "item4",
    name: "Check Service Tag and Expiry Date",
    controlInterval: "monthly",
    bufferDays: 7,
    currentValue: undefined,
    notes: "",
    photo: null,
    priority: "medium",
    instructions: "Verify last service date and next due date. Tag should be legible and secure.",
  },
  {
    id: "item5",
    name: "Inspect Mounting Bracket Security",
    controlInterval: "monthly",
    bufferDays: 7,
    currentValue: undefined,
    notes: "",
    photo: null,
    priority: "low",
    instructions: "Ensure bracket is firmly attached to wall and extinguisher is secure.",
  },
]

const getPriorityColor = (priority: string) => {
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

export default function ChecklistItemPage({ params }: { params: { itemId: string } }) {
  const router = useRouter()
  const [checklistItems, setChecklistItems] = useState(MOCK_CHECKLIST_ITEMS)
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const currentChecklistItem = checklistItems[currentItemIndex]

  const handleStatusChange = (status: InspectedItemStatus) => {
    const newItems = [...checklistItems]
    newItems[currentItemIndex].currentValue = status
    setChecklistItems(newItems)
  }

  const handleNotesChange = (notes: string) => {
    const newItems = [...checklistItems]
    newItems[currentItemIndex].notes = notes
    setChecklistItems(newItems)
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const newItems = [...checklistItems]
      newItems[currentItemIndex].photo = event.target.files[0]
      setChecklistItems(newItems)
      console.log("Photo selected:", event.target.files[0].name)
    }
  }

  const navigateItem = (direction: "next" | "prev") => {
    if (direction === "next" && currentItemIndex < checklistItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1)
    } else if (direction === "prev" && currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1)
    }
  }

  const completedItems = checklistItems.filter((item) => item.currentValue !== undefined).length
  const isFormComplete = checklistItems.every(
    (item) =>
      item.currentValue !== undefined &&
      (item.currentValue === "Approved" ||
        (item.currentValue === "Not Approved" && item.notes && item.notes.trim() !== "")),
  )
  const progressPercentage = (completedItems / checklistItems.length) * 100

  const finalizeReport = () => {
    if (!isFormComplete) {
      alert("Please complete all items. Notes are mandatory for 'Not Approved' items.")
      return
    }
    console.log("Finalizing report:", {
      asset: MOCK_ASSET_NAME,
      location: MOCK_LOCATION,
      inspector: MOCK_INSPECTOR,
      completedDate: new Date().toISOString(),
      items: checklistItems,
    })
    router.push("/inspector/dashboard?status=completed")
  }

  if (!currentChecklistItem) {
    return <PageTitle title="Error" description="Checklist item not found." />
  }

  return (
    <>
      <PageTitle
        title={`Inspection: ${MOCK_ASSET_NAME}`}
        icon={ShieldCheck}
        description={`${MOCK_LOCATION} • Due: ${new Date(MOCK_DUE_DATE).toLocaleDateString()}`}
      />

      {/* Inspection Header Info */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Inspector:</span>
              <span>{MOCK_INSPECTOR}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Location:</span>
              <span>{MOCK_LOCATION}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Due Date:</span>
              <span>{new Date(MOCK_DUE_DATE).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge className={getPriorityColor(currentChecklistItem.priority)}>
              {currentChecklistItem.priority.toUpperCase()} PRIORITY
            </Badge>
            <span className="text-sm text-muted-foreground">
              Item {currentItemIndex + 1} of {checklistItems.length}
            </span>
          </div>
          <Progress value={progressPercentage} className="mb-4" />
          <CardTitle className="text-lg">{currentChecklistItem.name}</CardTitle>
          {currentChecklistItem.instructions && (
            <CardDescription className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-4 border-blue-500">
              <strong>Instructions:</strong> {currentChecklistItem.instructions}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">Status Assessment</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant={currentChecklistItem.currentValue === "Approved" ? "default" : "outline"}
                onClick={() => handleStatusChange("Approved")}
                className={`h-20 text-lg ${currentChecklistItem.currentValue === "Approved" ? "bg-green-600 hover:bg-green-700 text-white" : "hover:bg-green-50 dark:hover:bg-green-900/50"}`}
              >
                <CheckSquare className="mr-2 h-6 w-6" />
                <div className="text-center">
                  <div>Approved</div>
                  <div className="text-xs opacity-75">Item passes inspection</div>
                </div>
              </Button>
              <Button
                variant={currentChecklistItem.currentValue === "Not Approved" ? "destructive" : "outline"}
                onClick={() => handleStatusChange("Not Approved")}
                className={`h-20 text-lg ${currentChecklistItem.currentValue === "Not Approved" ? "" : "hover:bg-red-50 dark:hover:bg-red-900/50"}`}
              >
                <XSquare className="mr-2 h-6 w-6" />
                <div className="text-center">
                  <div>Not Approved</div>
                  <div className="text-xs opacity-75">Item requires attention</div>
                </div>
              </Button>
            </div>
          </div>

          {currentChecklistItem.currentValue === "Not Approved" && (
            <div className="p-4 border border-destructive/50 rounded-md bg-destructive/5">
              <Label htmlFor="notes" className="flex items-center text-destructive mb-2">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Notes (Required for Non-Approved Items)
              </Label>
              <Textarea
                id="notes"
                placeholder="Describe the issue, required actions, safety concerns, etc."
                value={currentChecklistItem.notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                className="min-h-[120px] border-destructive focus:ring-destructive"
                required={currentChecklistItem.currentValue === "Not Approved"}
              />
            </div>
          )}

          {currentChecklistItem.currentValue === "Approved" && (
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any relevant observations, maintenance notes, or recommendations..."
                value={currentChecklistItem.notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="photo" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Photo Documentation{" "}
              {currentChecklistItem.currentValue === "Not Approved" ? "(Recommended)" : "(Optional)"}
            </Label>
            <div className="flex items-center gap-4">
              <Input id="photo" type="file" accept="image/*" onChange={handlePhotoUpload} className="flex-1" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => document.getElementById("photo")?.click()}
                className="shrink-0"
                title="Upload Photo"
              >
                <UploadCloud className="h-5 w-5" />
              </Button>
            </div>
            {currentChecklistItem.photo && (
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Photo attached: {currentChecklistItem.photo.name}
                </p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-6 border-t">
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={() => navigateItem("prev")}
              disabled={currentItemIndex === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" /> Previous Item
            </Button>
            <Button
              variant="outline"
              onClick={() => navigateItem("next")}
              disabled={currentItemIndex === checklistItems.length - 1}
              className="flex items-center gap-2"
            >
              Next Item <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-full text-center">
            <div className="text-sm text-muted-foreground mb-2">
              Progress: {completedItems} of {checklistItems.length} items completed
            </div>
            {currentItemIndex === checklistItems.length - 1 && (
              <Button size="lg" className="w-full font-semibold" onClick={finalizeReport} disabled={!isFormComplete}>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Complete & Submit Inspection Report
              </Button>
            )}
            {!isFormComplete && currentItemIndex === checklistItems.length - 1 && (
              <p className="text-xs text-destructive mt-2">
                Please complete all items. Notes are required for any 'Not Approved' items.
              </p>
            )}
          </div>
        </CardFooter>
      </Card>
    </>
  )
}
