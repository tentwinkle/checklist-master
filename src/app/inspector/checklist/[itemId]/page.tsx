"use client";

import { useState } from 'react';
import { PageTitle } from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CheckSquare, XSquare, AlertTriangle, ChevronLeft, ChevronRight, CheckCircle2, UploadCloud, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ChecklistItemDef, InspectedItemStatus } from "@/types";

// Mock data for a single asset with multiple checklist items
const MOCK_ASSET_NAME = "Fire Extinguisher FE-102 (Corridor A)";
const MOCK_CHECKLIST_ITEMS: (ChecklistItemDef & { currentValue?: InspectedItemStatus; notes?: string; photo?: File | null })[] = [
  { id: "item1", name: "Check Pressure Gauge", controlInterval: "monthly", bufferDays: 7, currentValue: undefined, notes: "", photo: null },
  { id: "item2", name: "Inspect Hose & Nozzle for cracks/blockages", controlInterval: "monthly", bufferDays: 7, currentValue: undefined, notes: "", photo: null },
  { id: "item3", name: "Verify Accessibility and Signage", controlInterval: "monthly", bufferDays: 7, currentValue: undefined, notes: "", photo: null },
  { id: "item4", name: "Check Last Service Date Tag", controlInterval: "monthly", bufferDays: 7, currentValue: undefined, notes: "", photo: null },
];

export default function ChecklistItemPage({ params }: { params: { itemId: string } }) {
  const router = useRouter();
  const [checklistItems, setChecklistItems] = useState(MOCK_CHECKLIST_ITEMS);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const currentChecklistItem = checklistItems[currentItemIndex];

  const handleStatusChange = (status: InspectedItemStatus) => {
    const newItems = [...checklistItems];
    newItems[currentItemIndex].currentValue = status;
    setChecklistItems(newItems);
  };

  const handleNotesChange = (notes: string) => {
    const newItems = [...checklistItems];
    newItems[currentItemIndex].notes = notes;
    setChecklistItems(newItems);
  };
  
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const newItems = [...checklistItems];
      newItems[currentItemIndex].photo = event.target.files[0];
      setChecklistItems(newItems);
      console.log("Photo selected:", event.target.files[0].name);
    }
  };

  const navigateItem = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentItemIndex < checklistItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    } else if (direction === 'prev' && currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    }
  };
  
  const isFormComplete = checklistItems.every(item => item.currentValue !== undefined && (item.currentValue === 'Approved' || (item.currentValue === 'Not Approved' && item.notes && item.notes.trim() !== '')));

  const finalizeReport = () => {
    if (!isFormComplete) {
      alert("Please complete all items. Notes are mandatory for 'Not Approved' items."); // Use toast in real app
      return;
    }
    console.log("Finalizing report:", checklistItems);
    // Navigate to a success/summary page or dashboard
    router.push("/inspector/dashboard?status=completed");
  };

  if (!currentChecklistItem) {
    return <PageTitle title="Error" description="Checklist item not found." />;
  }
  
  const progressPercentage = ((currentItemIndex + 1) / checklistItems.length) * 100;

  return (
    <>
      <PageTitle 
        title={`Inspection: ${MOCK_ASSET_NAME}`}
        icon={ShieldCheck}
        description={`Item ${currentItemIndex + 1} of ${checklistItems.length}: ${currentChecklistItem.name}`} 
      />

      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
           <div className="w-full bg-muted rounded-full h-2.5 mb-2">
            <div className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <CardTitle>Item: {currentChecklistItem.name}</CardTitle>
          <CardDescription>Mark status, add notes if necessary, and upload photos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-2 block">Status</Label>
            <RadioGroup 
              value={currentChecklistItem.currentValue} 
              onValueChange={(value) => handleStatusChange(value as InspectedItemStatus)}
              className="flex gap-4"
            >
              <Button 
                variant={currentChecklistItem.currentValue === 'Approved' ? 'default' : 'outline'}
                onClick={() => handleStatusChange('Approved')}
                className={`flex-1 h-16 text-lg ${currentChecklistItem.currentValue === 'Approved' ? 'bg-green-600 hover:bg-green-700 text-white' : 'hover:bg-green-50 dark:hover:bg-green-900/50'}`}
              >
                <CheckSquare className="mr-2 h-6 w-6" /> Approved
              </Button>
              <Button 
                variant={currentChecklistItem.currentValue === 'Not Approved' ? 'destructive' : 'outline'}
                onClick={() => handleStatusChange('Not Approved')}
                className={`flex-1 h-16 text-lg ${currentChecklistItem.currentValue === 'Not Approved' ? '' : 'hover:bg-red-50 dark:hover:bg-red-900/50'}`}
              >
                <XSquare className="mr-2 h-6 w-6" /> Not Approved
              </Button>
            </RadioGroup>
          </div>

          {(currentChecklistItem.currentValue === 'Not Approved') && (
            <div className="p-3 border border-destructive/50 rounded-md bg-destructive/5">
              <Label htmlFor="notes" className="flex items-center text-destructive mb-1">
                <AlertTriangle className="h-4 w-4 mr-1"/> Notes (Mandatory if Not Approved)
              </Label>
              <Textarea 
                id="notes" 
                placeholder="Describe the issue, required actions, etc." 
                value={currentChecklistItem.notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                className="min-h-[100px] border-destructive focus:ring-destructive"
                required={currentChecklistItem.currentValue === 'Not Approved'}
              />
            </div>
          )}
          {currentChecklistItem.currentValue === 'Approved' && (
             <div className="space-y-1">
              <Label htmlFor="notes">Optional Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Add any relevant observations..." 
                value={currentChecklistItem.notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="photo">Upload Photo (Optional)</Label>
            <div className="flex items-center gap-4">
              <Input id="photo" type="file" accept="image/*" onChange={handlePhotoUpload} className="flex-1" />
              <Button variant="outline" size="icon" onClick={() => document.getElementById('photo')?.click()} className="shrink-0">
                <UploadCloud className="h-5 w-5" />
              </Button>
            </div>
            {currentChecklistItem.photo && (
              <p className="text-sm text-muted-foreground">Selected: {currentChecklistItem.photo.name}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="flex justify-between w-full">
            <Button variant="outline" onClick={() => navigateItem('prev')} disabled={currentItemIndex === 0}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button variant="outline" onClick={() => navigateItem('next')} disabled={currentItemIndex === checklistItems.length - 1}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          {currentItemIndex === checklistItems.length - 1 && (
            <Button 
              size="lg" 
              className="w-full font-semibold mt-4" 
              onClick={finalizeReport}
              disabled={!isFormComplete}
            >
              <CheckCircle2 className="mr-2 h-5 w-5" /> Finalize Inspection Report
            </Button>
          )}
           {!isFormComplete && currentItemIndex === checklistItems.length -1 && (
            <p className="text-xs text-destructive text-center mt-2">
              Please complete all items. Notes are mandatory for 'Not Approved' items before finalizing.
            </p>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
