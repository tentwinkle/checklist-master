"use client";

import { useState } from 'react';
import { PageTitle } from "@/components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScanLine, Camera, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ScanQrPage() {
  const router = useRouter();
  const [qrCodeData, setQrCodeData] = useState("");
  const [error, setError] = useState("");

  const handleManualEntry = () => {
    if (!qrCodeData.trim()) {
      setError("Please enter QR code data.");
      return;
    }
    setError("");
    // Simulate loading item based on QR code
    console.log("QR Code Data Submitted:", qrCodeData);
    // Navigate to a mock checklist item page
    router.push(`/inspector/checklist/item-${qrCodeData.slice(0,5)}`); 
  };
  
  const handleScan = () => {
    // Placeholder for actual camera scan logic
    // For now, simulate a successful scan and redirect
    const mockScannedId = `item-scan${Math.floor(Math.random()*1000)}`;
    console.log("Simulating QR scan, found ID:", mockScannedId);
    router.push(`/inspector/checklist/${mockScannedId}`);
  };

  return (
    <>
      <PageTitle title="Scan QR Code" icon={ScanLine} description="Scan an item's QR code to begin inspection or enter data manually." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-6 w-6 text-primary" />
              Use Camera to Scan
            </CardTitle>
            <CardDescription>Point your device's camera at the QR code.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {/* Placeholder for camera feed */}
            <div className="bg-muted aspect-video w-full rounded-md flex items-center justify-center mb-4">
              <Image 
                src="https://placehold.co/400x225.png" 
                alt="QR Scanner Placeholder" 
                width={400} 
                height={225} 
                className="rounded-md object-cover"
                data-ai-hint="qr code scanner"
              />
            </div>
            <Button size="lg" className="w-full font-semibold" onClick={handleScan}>
              <Camera className="mr-2 h-5 w-5" /> Activate Scanner
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Ensure you have given camera permissions.</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Manual QR Code Entry</CardTitle>
            <CardDescription>If scanning is unavailable, type the QR code data below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="qrData">QR Code Data</Label>
              <Input 
                id="qrData" 
                placeholder="e.g., ASSET-123-XYZ" 
                value={qrCodeData}
                onChange={(e) => { setQrCodeData(e.target.value); setError(""); }}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive flex items-center"><AlertTriangle className="h-4 w-4 mr-1" />{error}</p>
            )}
            <Button className="w-full" onClick={handleManualEntry}>
              Load Item from QR Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
