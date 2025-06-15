"use client"

import { useState, useRef, useEffect } from "react"
import { PageTitle } from "@/components/shared/PageTitle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScanLine, Camera, Hash, MapPin, ClipboardList, ArrowRight, Smartphone, Wifi } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface ScannedItem {
  qrCode: string
  itemName: string
  location: string
  inspectionType: string
  department: string
  lastInspection?: string
  status: "Due" | "Upcoming" | "Overdue"
}

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [manualCode, setManualCode] = useState("")
  const [scannedItem, setScannedItem] = useState<ScannedItem | null>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  // Mock QR code database
  const mockQRDatabase: Record<string, ScannedItem> = {
    "FE-102-RUG": {
      qrCode: "FE-102-RUG",
      itemName: "Fire Extinguisher FE-102",
      location: "Corridor A, Building 1 - Rugvænget",
      inspectionType: "Fire Extinguisher",
      department: "Rugvænget",
      lastInspection: "2023-07-15",
      status: "Due",
    },
    "FE-103-RUG": {
      qrCode: "FE-103-RUG",
      itemName: "Fire Extinguisher FE-103",
      location: "Stairwell B, Building 1 - Rugvænget",
      inspectionType: "Fire Extinguisher",
      department: "Rugvænget",
      lastInspection: "2023-07-15",
      status: "Overdue",
    },
    "CR-001-PAR": {
      qrCode: "CR-001-PAR",
      itemName: "Community Room 1",
      location: "Ground Floor - Parkvej",
      inspectionType: "Community Room",
      department: "Parkvej",
      lastInspection: "2023-12-01",
      status: "Upcoming",
    },
    "VH-205-TEG": {
      qrCode: "VH-205-TEG",
      itemName: "Vehicle VH-205",
      location: "Parking Lot B - Teglstenen",
      inspectionType: "Vehicle",
      department: "Teglstenen",
      lastInspection: "2023-08-15",
      status: "Due",
    },
  }

  const startCamera = async () => {
    setIsScanning(true)
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera on mobile
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Camera access denied:", err)
      setError("Camera access denied. Please allow camera permissions or use manual entry.")
      setIsScanning(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  const handleManualEntry = () => {
    if (manualCode.trim()) {
      processQRCode(manualCode.trim().toUpperCase())
    }
  }

  const processQRCode = (code: string) => {
    const item = mockQRDatabase[code]
    if (item) {
      setScannedItem(item)
      setError(null)
      stopCamera()
    } else {
      setError(`QR Code "${code}" not found in database. Please check the code and try again.`)
      setScannedItem(null)
    }
  }

  const startInspection = () => {
    if (scannedItem) {
      // Navigate to inspection with the scanned item data
      router.push(`/inspector/checklist/${scannedItem.qrCode}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Due":
        return "default"
      case "Upcoming":
        return "secondary"
      case "Overdue":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Simulate QR code detection (in real app, use a QR code library)
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        // Simulate scanning - in real app, this would be QR code detection
        // For demo, we'll auto-detect after 3 seconds
        const codes = Object.keys(mockQRDatabase)
        const randomCode = codes[Math.floor(Math.random() * codes.length)]
        // Uncomment below to simulate auto-detection
        // processQRCode(randomCode)
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [isScanning])

  return (
    <>
      <PageTitle
        title="Scan QR Code"
        icon={ScanLine}
        description="Scan QR codes on items to start inspections or enter codes manually."
      />

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Camera Scanner */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              QR Code Scanner
            </CardTitle>
            <CardDescription>Point your camera at the QR code on the item you want to inspect.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isScanning ? (
              <div className="text-center py-8">
                <div className="w-32 h-32 mx-auto mb-4 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                  <ScanLine className="h-16 w-16 text-muted-foreground" />
                </div>
                <Button onClick={startCamera} size="lg" className="w-full md:w-auto">
                  <Camera className="mr-2 h-5 w-5" />
                  Start Camera Scanner
                </Button>
                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground justify-center">
                  <Smartphone className="h-4 w-4" />
                  <span>Optimized for mobile devices</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-64 bg-black rounded-lg object-cover" />
                  <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary rounded-lg">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary"></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button onClick={stopCamera} variant="outline">
                    Stop Scanner
                  </Button>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  <Wifi className="h-4 w-4 inline mr-1" />
                  Position QR code within the frame
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Entry */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Manual Entry
            </CardTitle>
            <CardDescription>Enter the QR code manually if scanning is not available.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="manualCode">QR Code</Label>
              <div className="flex gap-2">
                <Input
                  id="manualCode"
                  placeholder="e.g., FE-102-RUG"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  className="flex-1"
                />
                <Button onClick={handleManualEntry} disabled={!manualCode.trim()}>
                  Lookup
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              <strong>Sample codes to try:</strong> FE-102-RUG, FE-103-RUG, CR-001-PAR, VH-205-TEG
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-destructive">
                <ScanLine className="h-5 w-5" />
                <span className="font-medium">Scan Error</span>
              </div>
              <p className="text-sm text-destructive mt-1">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Scanned Item Display */}
        {scannedItem && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <ClipboardList className="h-5 w-5" />
                Item Found
              </CardTitle>
              <CardDescription>QR Code: {scannedItem.qrCode}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Item Name</Label>
                  <p className="text-lg font-semibold">{scannedItem.itemName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <Badge variant={getStatusColor(scannedItem.status)}>{scannedItem.status}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <p className="text-sm">{scannedItem.location}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <p>{scannedItem.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Inspection Type</Label>
                  <p>{scannedItem.inspectionType}</p>
                </div>
              </div>

              {scannedItem.lastInspection && (
                <div>
                  <Label className="text-sm font-medium">Last Inspection</Label>
                  <p className="text-sm">{new Date(scannedItem.lastInspection).toLocaleDateString()}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button onClick={startInspection} size="lg" className="w-full">
                  Start Inspection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Access */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Quick Access</CardTitle>
            <CardDescription>Common actions for inspectors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/inspector/my-inspections">
                <Button variant="outline" className="w-full justify-start">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  My Inspections
                </Button>
              </Link>
              <Link href="/inspector/dashboard">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
