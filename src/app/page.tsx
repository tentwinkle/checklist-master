
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-12">
        <Logo size="lg" />
        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
          Streamlining inspections across Region Holbæk for enhanced safety and compliance.
        </p>
      </div>

      <div className="mt-8">
        <Link href="/login">
          <Button size="lg" className="font-semibold text-base px-8 py-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            Login to Get Started
          </Button>
        </Link>
      </div>

       <footer className="absolute bottom-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Region Holbæk. All rights reserved.</p>
        <p>Built for efficiency and safety.</p>
      </footer>
    </div>
  );
}
