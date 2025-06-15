"use client";

import Link from "next/link";
import { User, LogOut, Settings, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "./Logo";
import { SidebarTrigger } from "@/components/ui/sidebar"; // Import SidebarTrigger

// Mock user data for now
const MOCK_USER = {
  name: "Admin User", // Updated to match screenshot
  email: "user@example.com",
  avatarUrl: "https://placehold.co/100x100.png",
  initials: "AU", // Updated initials
};

export function AppHeader() {
  const { setTheme, theme } = useTheme();
  const user = MOCK_USER;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-none"> {/* Use container mx-auto and max-w-none for full width */}
        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <SidebarTrigger /> 
          </div>
          {/* Logo is primarily in the sidebar now, header shows it for mobile collapsed or as main brand element */}
          <div className="hidden md:block">
           <Logo size="md" /> {/* Use 'md' size for header logo */}
          </div>
        </div>
        
        {/* This centered logo for mobile can be removed if SidebarTrigger and Sidebar content handle mobile branding sufficiently */}
        <div className="md:hidden flex-1 flex justify-center">
          <Logo size="sm" />
        </div>

        <div className="flex items-center gap-x-3 sm:gap-x-4">
           {/* Language switcher placeholder - to be implemented if needed 
           <Button variant="ghost" size="sm">
            English
            <ChevronDown className="ml-1 h-4 w-4 opacity-50" />
           </Button>
           */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar" />
                  <AvatarFallback>{user.initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild> {/* Ensure Link is used for navigation */}
                <Link href="/login">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
