
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PageTitle } from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, ArrowLeft, FileText, Save, XCircle, CalendarIcon, MapPin, PlusCircle, UploadCloud, User, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Mock data for form names, mirroring what's in FormsPage for consistency
const MOCK_FORM_DEFINITIONS: { id: string; name: string; description?: string; fields?: any[] }[] = [
  { id: "jha", name: "JHA - Job Hazard Analysis", description: "Define steps, identify hazards, and specify controls." },
  { id: "safety", name: "Safety Inspection", description: "General safety checklist for various environments." },
  { id: "standdown", name: "Safety Stand Down", description: "Record topics and attendance for safety meetings." },
  { id: "excavation", name: "Excavation/Trenching Inspection", description: "Checklist for safe excavation practices." },
  { id: "confined", name: "Confined Space Entry Permit", description: "Permit for entering confined spaces." },
  { id: "hotwork", name: "Hot Work Permit", description: "Permit for operations involving open flames or sparks." },
  { id: "lifting", name: "Lifting Operations Plan", description: "Plan for safe lifting and rigging." },
];

// JHA Form Specific State
interface JHAFormData {
  project: string;
  date: Date | undefined;
  location: string;
  taskOperation: string;
  potentialHazards: string;
  potentialHazardsDetails: string;
  revisedToolUse: string;
  controlsToBeImplemented: string;
  supervisorName: string;
  supervisorSignature: string;
  employeeName: string;
  employeeSignature: string;
  uploadedImages: File[];
}

const initialJHAData: JHAFormData = {
  project: "",
  date: undefined,
  location: "",
  taskOperation: "",
  potentialHazards: "",
  potentialHazardsDetails: "",
  revisedToolUse: "",
  controlsToBeImplemented: "",
  supervisorName: "A", // From image
  supervisorSignature: "",
  employeeName: "",
  employeeSignature: "",
  uploadedImages: [],
};


export default function EditFormTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as string;

  const [formDefinition, setFormDefinition] = useState<{ id: string; name: string; description?: string; } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jhaData, setJhaData] = useState<JHAFormData>(initialJHAData);

  useEffect(() => {
    if (!formId) return;
    setIsLoading(true);
    setError(null);
    const foundForm = MOCK_FORM_DEFINITIONS.find(f => f.id === formId);
    if (foundForm) {
      setFormDefinition(foundForm);
    } else {
      setError("Form template not found.");
    }
    setIsLoading(false);
  }, [formId]);

  const handleJHAInputChange = (field: keyof JHAFormData, value: any) => {
    setJhaData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // Max 6 files logic would be handled here or in a separate function
      const newFiles = Array.from(event.target.files).slice(0, 6 - jhaData.uploadedImages.length);
      handleJHAInputChange('uploadedImages', [...jhaData.uploadedImages, ...newFiles]);
    }
  };


  const handleSaveChanges = () => {
    if (formId === 'jha') {
      console.log("Saving JHA Form Data:", jhaData);
      alert(`JHA Form "${formDefinition?.name}" data would be saved (see console).`);
    } else {
      console.log("Saving changes for generic form:", formDefinition);
      alert(`Changes for "${formDefinition?.name}" would be saved here.`);
    }
    router.push("/admin/forms");
  };

  if (isLoading) {
    return (
      <>
        <PageTitle title="Loading Form Template..." icon={FileText} />
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-64 w-full" /> {/* Placeholder for form fields */}
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-end gap-2">
             <Skeleton className="h-10 w-24" />
             <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageTitle title="Error" icon={AlertTriangle} description="Could not load form template." />
        <Card className="shadow-lg">
          <CardContent className="py-8 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => router.push("/admin/forms")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Forms
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }

  if (!formDefinition) {
    return <PageTitle title="Form Template Not Found" icon={AlertTriangle} />;
  }
  
  // JHA Form Specific Rendering
  if (formId === 'jha') {
    return (
      <>
        <PageTitle 
          title={formDefinition.name}
          icon={Edit} 
          description={formDefinition.description || `Fill out the Job Hazard Analysis form.`} 
        />
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{formDefinition.name}</CardTitle>
            <CardDescription>All fields marked with * are notionally required.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="space-y-1">
                <Label htmlFor="jhaProject">Project</Label>
                <Select value={jhaData.project} onValueChange={(value) => handleJHAInputChange('project', value)}>
                  <SelectTrigger id="jhaProject"><SelectValue placeholder="Select Project" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proj1">Project Alpha</SelectItem>
                    <SelectItem value="proj2">Project Beta</SelectItem>
                    <SelectItem value="proj3">Maintenance Task Omega</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="jhaDate">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !jhaData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {jhaData.date ? format(jhaData.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={jhaData.date}
                      onSelect={(date) => handleJHAInputChange('date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1">
                <Label htmlFor="jhaLocation">Location</Label>
                <div className="relative">
                  <Input 
                    id="jhaLocation" 
                    placeholder="Enter location" 
                    value={jhaData.location}
                    onChange={(e) => handleJHAInputChange('location', e.target.value)}
                    className="pr-10"
                  />
                  <MapPin className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="jhaTaskOperation">Task/Operation</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="jhaTaskOperation" 
                    placeholder="Enter task" 
                    value={jhaData.taskOperation}
                    onChange={(e) => handleJHAInputChange('taskOperation', e.target.value)}
                  />
                  <Button variant="outline" size="icon" disabled><PlusCircle className="h-4 w-4"/></Button> {/* Placeholder Add */}
                </div>
              </div>
            </div>

            {/* Row 2 & Textarea */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="md:col-span-1 space-y-1">
                <Label htmlFor="jhaPotentialHazards">Potential Hazards</Label>
                <Select value={jhaData.potentialHazards} onValueChange={(value) => handleJHAInputChange('potentialHazards', value)}>
                  <SelectTrigger id="jhaPotentialHazards"><SelectValue placeholder="Select Hazard" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slip">Slip/Trip Hazard</SelectItem>
                    <SelectItem value="fall">Fall from Height</SelectItem>
                    <SelectItem value="electrical">Electrical Shock</SelectItem>
                    <SelectItem value="chemical">Chemical Exposure</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea 
                  placeholder="Details for potential hazards..." 
                  className="mt-2 min-h-[80px]"
                  value={jhaData.potentialHazardsDetails}
                  onChange={(e) => handleJHAInputChange('potentialHazardsDetails', e.target.value)}
                />
              </div>
              <div className="md:col-span-1 space-y-1">
                <Label htmlFor="jhaRevisedToolUse">Revised Tool Use</Label>
                <Select value={jhaData.revisedToolUse} onValueChange={(value) => handleJHAInputChange('revisedToolUse', value)}>
                  <SelectTrigger id="jhaRevisedToolUse"><SelectValue placeholder="Select Tool Use" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Procedure</SelectItem>
                    <SelectItem value="modified">Modified Procedure</SelectItem>
                    <SelectItem value="newTool">New Tool/Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-1 space-y-1">
                <Label htmlFor="jhaControls">Controls to be Implemented</Label>
                <Select value={jhaData.controlsToBeImplemented} onValueChange={(value) => handleJHAInputChange('controlsToBeImplemented', value)}>
                  <SelectTrigger id="jhaControls"><SelectValue placeholder="Select Controls" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ppe">PPE Required</SelectItem>
                    <SelectItem value="guarding">Machine Guarding</SelectItem>
                    <SelectItem value="loto">Lockout/Tagout</SelectItem>
                    <SelectItem value="training">Additional Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Image Upload */}
            <div className="space-y-1">
              <Label>Upload Images (Max 6, Day Before Work Begins)</Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-muted-foreground/30 rounded-md">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="flex text-sm text-muted-foreground">
                    <Label
                      htmlFor="jhaFile-upload"
                      className="relative cursor-pointer rounded-md bg-background font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                    >
                      <span>Click to upload</span>
                      <Input id="jhaFile-upload" name="jhaFile-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleImageUpload} />
                    </Label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB. Max 6 images.</p>
                </div>
              </div>
              {jhaData.uploadedImages.length > 0 && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Files selected: {jhaData.uploadedImages.map(f => f.name).join(', ')}
                </div>
              )}
            </div>

            {/* Supervisor Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="jhaSupervisorName">Supervisor/Foreman Name</Label>
                <Input 
                  id="jhaSupervisorName" 
                  value={jhaData.supervisorName}
                  onChange={(e) => handleJHAInputChange('supervisorName', e.target.value)} 
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="jhaSupervisorSig">Supervisor/Foreman Signature</Label>
                <Textarea 
                  id="jhaSupervisorSig" 
                  placeholder="Signature (type name or draw)" 
                  className="min-h-[60px]"
                  value={jhaData.supervisorSignature}
                  onChange={(e) => handleJHAInputChange('supervisorSignature', e.target.value)}
                />
              </div>
            </div>

            {/* Employee Acknowledgement */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-semibold">Employee Acknowledgement Signatures</h3>
                <Button variant="outline" size="sm" disabled><PlusCircle className="mr-2 h-4 w-4" /> Add Employee Signature</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="jhaEmployeeName">Employee Name</Label>
                  <Input 
                    id="jhaEmployeeName" 
                    placeholder="Employee Name" 
                    value={jhaData.employeeName}
                    onChange={(e) => handleJHAInputChange('employeeName', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="jhaEmployeeSig">Signature</Label>
                  <Textarea 
                    id="jhaEmployeeSig" 
                    placeholder="Signature (type name or draw)" 
                    className="min-h-[60px]"
                    value={jhaData.employeeSignature}
                    onChange={(e) => handleJHAInputChange('employeeSignature', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 mt-4 flex justify-end gap-2">
            <Link href="/admin/forms">
              <Button variant="outline" type="button">
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </Link>
            <Button onClick={handleSaveChanges}>
              <Save className="mr-2 h-4 w-4" />
              Submit JHA
            </Button>
          </CardFooter>
        </Card>
      </>
    );
  }

  // Fallback for other form types (Generic Placeholder)
  return (
    <>
      <PageTitle 
        title={`Edit Form: ${formDefinition.name}`} 
        icon={FileText} 
        description={formDefinition.description || `Customize the fields and settings for this form template.`} 
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Form Template Details</CardTitle>
          <CardDescription>Modify the name, description, and fields for the &quot;{formDefinition.name}&quot; template.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="formName">Form Name</Label>
            <Input id="formName" defaultValue={formDefinition.name} placeholder="Enter form name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="formDescription">Form Description (Optional)</Label>
            <Textarea id="formDescription" defaultValue={formDefinition.description} placeholder="Describe the purpose of this form" />
          </div>
          
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Form Fields</h3>
            <CardDescription className="mb-4">Define the questions and input types for this form.</CardDescription>
            <div className="p-8 border-2 border-dashed border-muted-foreground/30 rounded-md text-center bg-muted/20">
              <p className="text-muted-foreground">Form builder interface for &quot;{formDefinition.name}&quot; will be here.</p>
              <p className="text-sm text-muted-foreground"> (e.g., add text fields, multiple choice, date pickers, etc.)</p>
              <Button variant="outline" className="mt-4" disabled>Add New Field (Coming Soon)</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6 mt-4 flex justify-end gap-2">
           <Link href="/admin/forms">
             <Button variant="outline" type="button">
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
            </Button>
           </Link>
          <Button onClick={handleSaveChanges}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

