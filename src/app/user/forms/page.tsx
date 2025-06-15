
import { PageTitle } from "@/components/shared/PageTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UserFormsPage() {
  // Mock list of forms a user might fill out
  const availableForms = [
    { id: "jha", name: "Job Hazard Analysis (JHA)", description: "Submit a JHA form." },
    { id: "safety", name: "Safety Observation Report", description: "Report a safety observation." },
  ];

  return (
    <>
      <PageTitle title="Forms" icon={FileText} description="Access and submit available forms." />
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Available Forms</CardTitle>
          <CardDescription>Select a form to fill out and submit.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableForms.length > 0 ? (
            availableForms.map((form) => (
              <Card key={form.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{form.name}</CardTitle>
                  {form.description && <CardDescription>{form.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                  {/* In a real app, this link would go to the specific form filling page for the user */}
                  <Link href={`/user/forms/fill/${form.id}`} passHref>
                    <Button>Fill Out Form</Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">No forms are currently available for you.</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
