"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Library, LogOut, Search, Bell, Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@clerk/nextjs"
import { supabase } from "@/lib/db"

interface FloatingNavbarProps {
  userName?: string
  userImage?: string
  notificationCount?: number
}

export function Navbar({ userName = "Adrian", userImage, notificationCount = 0 }: FloatingNavbarProps) {
  const { isSignedIn, user, isLoaded } = useUser()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled])

  useEffect(() => {
    if (!isLoaded || !user) return;

    const handleUserSync = async () => {
      try {
        // Check if user exists in Supabase
        const { data: existingUser, error: fetchError } = await supabase
          .from("userTable")
          .select("*")
          .eq("clerkID", user.id)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Error checking user:", fetchError);
          return;
        }

        if (!existingUser) {
          // Register new user in Supabase
          const { error: insertError } = await supabase.from("userTable").insert({
            clerkID: user.id,
            imageUrl: user.imageUrl,
            emailAddress: user.emailAddresses[0]?.emailAddress,
            fullName: user.fullName,
          });

          if (insertError) {
            console.error("Error registering user:", insertError);
            return;
          }
          console.log("User registered successfully");
        } else {
          // Update existing user's information
          const { error: updateError } = await supabase
            .from("userTable")
            .update({
              imageUrl: user.imageUrl,
              emailAddress: user.emailAddresses[0]?.emailAddress,
              fullName: user.fullName,
            })
            .eq("clerkID", user.id);

          if (updateError) {
            console.error("Error updating user:", updateError);
            return;
          }
          console.log("User information updated successfully");
        }
      } catch (err) {
        console.error("Error in user sync:", err);
      }
    };

    handleUserSync();
  }, [isLoaded, user]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        scrolled
          ? "bg-slate-900/80 backdrop-blur-lg shadow-lg py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-10">
          <div className="h-8 w-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
            <Library className="h-5 w-5 text-white" />
          </div>
          <span className={cn(
            "text-xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent",
            scrolled ? "opacity-100" : "opacity-100"
          )}>
            BookWise
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/browse">Browse</NavLink>
          <NavLink href="/dashboard">Dashboard</NavLink>
          <NavLink href="/about">About</NavLink>
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-300 hover:text-amber-400 hover:bg-slate-800/50"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 relative"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-amber-500 text-slate-950">
                {notificationCount}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 border-2 border-amber-500/20">
                  <AvatarImage src={userImage || "/placeholder-user.jpg"} alt={userName} />
                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                    {userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-white" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
                My Books
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer text-rose-400">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-slate-300 hover:text-amber-400 hover:bg-slate-800/50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Expandable Search Bar */}
      <div className={cn(
        "absolute left-0 right-0 top-full bg-slate-900/90 backdrop-blur-lg transition-all duration-300 overflow-hidden border-t border-slate-800/50",
        searchOpen ? "max-h-20 py-4 opacity-100" : "max-h-0 py-0 opacity-0"
      )}>
        <div className="container mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search for books, authors, genres..." 
              className="pl-10 bg-slate-800/50 border-slate-700 text-white focus-visible:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "absolute left-0 right-0 top-full bg-slate-900/95 backdrop-blur-lg transition-all duration-300 overflow-hidden border-t border-slate-800/50 md:hidden",
        mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col gap-2">
            <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink href="/browse" onClick={() => setMobileMenuOpen(false)}>Browse</MobileNavLink>
            <MobileNavLink href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setMobileMenuOpen(false)}>About</MobileNavLink>
          </nav>
          
          <div className="mt-4 pt-4 border-t border-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border-2 border-amber-500/20">
                <AvatarImage src={userImage || "/placeholder-user.jpg"} alt={userName} />
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{userName}</p>
                <p className="text-xs text-slate-400">Member</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-400 hover:text-rose-400 hover:bg-slate-800/50"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 bg-slate-800/50 border-slate-700 text-white focus-visible:ring-amber-500"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

// Desktop Navigation Link
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="px-4 py-2 text-slate-300 hover:text-amber-400 font-medium transition-colors rounded-md hover:bg-slate-800/50"
    >
      {children}
    </Link>
  )
}

// Mobile Navigation Link
function MobileNavLink({ href, onClick, children }: { href: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="px-4 py-3 text-slate-200 hover:text-amber-400 font-medium transition-colors rounded-md hover:bg-slate-800/50 flex items-center"
      onClick={onClick}
    >
      {children}
    </Link>
  )
}
