"use client"

import { useUser } from "@clerk/nextjs"
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, Menu, X } from "lucide-react"
import Link from "next/link"
import { Library } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/db"

export const TopNavbar = () => {
  const { isSignedIn, user, isLoaded } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Check admin status when user signs in
  useEffect(() => {
    if (!isLoaded || !user) {
      setIsAdmin(false)
      return
    }

    const checkAdminStatus = async () => {
      const { data, error } = await supabase
        .from("userTable")
        .select("isadmin")
        .eq("clerkID", user.id)
        .single()

      if (!error && data) {
        setIsAdmin(data.isadmin)
      }
    }

    checkAdminStatus()
  }, [isLoaded, user])

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
    const syncUserWithSupabase = async () => {
      if (!isLoaded || !isSignedIn || !user) return
      const clerkID = user.id
      // Check if user exists
      const { data, error } = await supabase
        .from("userTable")
        .select("clerkID")
        .eq("clerkID", clerkID)
        .single()
      if (!data) {
        // Insert user if not exists
        const { error: insertError } = await supabase.from("userTable").insert([
          {
            clerkID: user.id,
            fullName: user.fullName,
            emailAddress: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || "",
            imageUrl: user.imageUrl,
            isadmin: false,
            created_at: new Date().toISOString(),
          },
        ])
        if (insertError) {
          console.error("Failed to insert user in Supabase:", insertError)
        } else {
          console.log("User inserted in Supabase userTable.")
        }
      }
    }
    syncUserWithSupabase()
  }, [isLoaded, isSignedIn, user])

  return (
    <header
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out rounded-full",
        scrolled
          ? "bg-slate-900/80 backdrop-blur-lg shadow-lg py-3 w-[95%] max-w-7xl"
          : "bg-slate-900/50 backdrop-blur-sm py-3 w-[95%] max-w-7xl"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-10">
          <div className="h-8 w-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
            <Library className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
            BookWise
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/bookDetails">Books</NavLink>
         
          {isAdmin && <NavLink href="/dashboard">Admin Dashboard</NavLink>}
          <NavLink href="/profile">Profile</NavLink>
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

          {/* Notifications - Only show when signed in */}
          {isSignedIn && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 relative"
            >
              <Bell className="h-5 w-5" />
            </Button>
          )}

          {/* Auth Buttons / User Profile */}
          {isLoaded && (
            <>
              {isSignedIn ? (
                <div className="flex items-center gap-4">
                  {isAdmin && (
                    <Badge className="bg-amber-500 text-slate-950">
                      Admin
                    </Badge>
                  )}
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "h-9 w-9 border-2 border-amber-500/20",
                        userButtonPopoverCard: "bg-slate-800 border-slate-700",
                        userButtonPopoverActionButton: "hover:bg-slate-700 text-white",
                        userButtonPopoverActionButtonText: "text-white",
                        userButtonPopoverFooter: "border-t border-slate-700",
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <SignInButton mode="modal">
                    <Button 
                      variant="ghost" 
                      className="text-slate-300 hover:text-amber-400 hover:bg-slate-800/50"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button 
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      Sign Up
                    </Button>
                  </SignUpButton>
                </div>
              )}
            </>
          )}
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
        "absolute left-0 right-0 top-full bg-slate-900/90 backdrop-blur-lg transition-all duration-300 overflow-hidden border-t border-slate-800/50 rounded-b-2xl",
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
        "absolute left-0 right-0 top-full bg-slate-900/95 backdrop-blur-lg transition-all duration-300 overflow-hidden border-t border-slate-800/50 rounded-b-2xl md:hidden",
        mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col gap-2">
            <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink href="/bookDetails" onClick={() => setMobileMenuOpen(false)}>Books</MobileNavLink>
            {isSignedIn && <MobileNavLink href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileNavLink>}
            {isAdmin && <MobileNavLink href="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</MobileNavLink>}
            <MobileNavLink href="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</MobileNavLink>
          </nav>
          
          {isLoaded && (
            <div className="mt-4 pt-4 border-t border-slate-800/50">
              {isSignedIn ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "h-9 w-9 border-2 border-amber-500/20",
                          userButtonPopoverCard: "bg-slate-800 border-slate-700",
                          userButtonPopoverActionButton: "hover:bg-slate-700 text-white",
                          userButtonPopoverActionButtonText: "text-white",
                          userButtonPopoverFooter: "border-t border-slate-700",
                        }
                      }}
                    />
                    <div>
                      <p className="font-medium text-sm text-white">{user?.fullName}</p>
                      <p className="text-xs text-slate-400">
                        {isAdmin ? 'Admin' : 'Member'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <SignInButton mode="modal">
                    <Button 
                      variant="ghost" 
                      className="w-full text-slate-300 hover:text-amber-400 hover:bg-slate-800/50"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button 
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      Sign Up
                    </Button>
                  </SignUpButton>
                </div>
              )}
            </div>
          )}
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

export default TopNavbar 