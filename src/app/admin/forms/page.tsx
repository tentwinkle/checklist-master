
"use client";

import React, { useState } from 'react';
import { PageTitle } from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Eye, FileText, Filter as FilterIcon, Search, Layers, PlusCircle } from "lucide-react";
import Link from "next/link";

interface FormItem {
  id: string;
  name: string;
  isActive: boolean;
  // Future fields could include: category, lastUpdated, version, etc.
}

// Mock data for demonstration. In a real app, this would come from an API.
const MOCK_FORMS: FormItem[] = [
  { id: "jha", name: "JHA- Job Hazard Analysis", isActive: true },
  { id: "safety", name: "Safety Inspection", isActive: true },
  { id: "standdown", name: "Safety Stand Down", isActive: true },
  { id: "excavation", name: "Excavation/Trenching Inspection", isActive: true },
  { id: "confined", name: "Confined Space Entry Permit", isActive: false },
  { id: "hotwork", name: "Hot Work Permit", isActive: true },
  { id: "lifting", name: "Lifting Operations Plan", isActive: false },
];

export default function FormsPage() {
  const [forms, setForms] = useState<FormItem[]>(MOCK_FORMS);
  const [searchTerm, setSearchTerm] = useState("");

  const handleStatusChange = (formId: string, isActive: boolean) => {
    setForms(prevForms =>
      prevForms.map(form =>
        form.id === formId ? { ...form, isActive } : form
      )
    );
    // In a real app, you would also make an API call here to update the status.
    // Example: toast({ title: `Form ${formId} status updated to ${isActive ? 'active' : 'inactive'}` });
    console.log(`Form ${formId} status changed to ${isActive ? 'active' : 'inactive'}`);
  };

  const filteredForms = forms.filter(form =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <PageTitle
        title="Forms"
        icon={FileText}
        description="Manage and configure all available form templates."
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search forms..."
                className="pl-8 w-48 md:w-64 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="shadow-sm" disabled> {/* Filter functionality not yet implemented */}
              <FilterIcon className="mr-2 h-4 w-4" /> Filter
            </Button>
            {/* Placeholder for Add New Form button 
            <Link href="/admin/forms/add"> 
              <Button className="shadow-sm">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Form
              </Button>
            </Link>
            */}
          </div>
        }
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Form Templates</CardTitle>
          <CardDescription>
            A list of all available form templates in the system. Toggle their status as needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60%]">Form Name</TableHead>
                <TableHead>Status (Active)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredForms.length > 0 ? (
                filteredForms.map((form) => (
                  <TableRow key={form.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium py-3">{form.name}</TableCell>
                    <TableCell className="py-3">
                      <Switch
                        checked={form.isActive}
                        onCheckedChange={(checked) => handleStatusChange(form.id, checked)}
                        aria-label={`Toggle status for ${form.name}`}
                        id={`status-${form.id}`}
                      />
                    </TableCell>
                    <TableCell className="text-right py-3">
                      <Link href={`/admin/forms/edit/${form.id}`}>
                         <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-primary"
                            title="View/Edit Form Template"
                            // Button is now enabled to link to the edit page
                          >
                           <Eye className="h-4 w-4" />
                         </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-36 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Layers className="h-12 w-12 text-muted-foreground mb-3" />
                      <p className="text-lg font-medium text-muted-foreground">No forms match your search.</p>
                      <p className="text-sm text-muted-foreground">Try a different search term or clear the search.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
