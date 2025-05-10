"use client"

import { useState } from "react"
import { BookMarked, Plus, Users, Settings, LogOut, Library, ChevronRight, Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Import tab components
import AddBook from "@/components/dashboard/add-book"
import BorrowRequests from "@/components/dashboard/borrow-requests"
import DashboardOptions from "@/components/dashboard/options"
import UsersList from "@/components/dashboard/UsersList"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("add-books")

  // Render the active tab component
  const renderActiveTab = () => {
    switch (activeTab) {
      case "borrow-requests":
        return <BorrowRequests />
      case "add-books":
        return <AddBook />
      case "users":
        return <UsersList />
      case "options":
        return <DashboardOptions />
      default:
        return <AddBook />
    }
  }

  return (
    <div className="flex min-h-screen mt-24">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/60 backdrop-blur-sm border-r border-slate-800/50 h-screen sticky top-0 shadow-xl z-10 ">
        <div className="p-4 ">
          <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-3 py-2.5 mb-8 border border-slate-700/50 shadow-md">
            <Avatar className="h-9 w-9 border-2 border-amber-500/20">
              <AvatarImage src="/placeholder-user.jpg" alt="Adrian" />
              <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">Ad</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">Adrian</span>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-amber-500 ml-auto h-8 w-8">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 pl-2">
              Management
            </p>
            <NavButton 
              icon={BookMarked} 
              label="Borrow Requests" 
              isActive={activeTab === "borrow-requests"} 
              onClick={() => setActiveTab("borrow-requests")}
              badge="3"
            />
            <NavButton 
              icon={Plus} 
              label="Add Books" 
              isActive={activeTab === "add-books"} 
              onClick={() => setActiveTab("add-books")} 
            />
            <NavButton 
              icon={Users} 
              label="Users" 
              isActive={activeTab === "users"} 
              onClick={() => setActiveTab("users")} 
            />
            <NavButton 
              icon={Settings} 
              label="Books" 
              isActive={activeTab === "options"} 
              onClick={() => setActiveTab("options")} 
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="h-16 border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-sm flex items-center px-6 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium">
              {activeTab === "borrow-requests" && "Borrow Requests"}
              {activeTab === "add-books" && "Add New Book"}
              {activeTab === "users" && "User Management"}
              {activeTab === "options" && "Books Collection"}
            </h1>
            <ChevronRight className="h-4 w-4 text-slate-500" />
            <span className="text-slate-400 text-sm">Dashboard</span>
          </div>
          
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full h-9 w-9 relative border-slate-700 bg-slate-800/50 hover:bg-slate-800">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-amber-500 rounded-full text-[10px] flex items-center justify-center text-white">2</span>
            </Button>
          </div>
        </header>
        
        {/* Content */}
        <div className="flex-1 p-6 pt-6">
          {renderActiveTab()}
        </div>
      </main>
    </div>
  )
}

// Helper component for navigation buttons
function NavButton({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick,
  badge
}: { 
  icon: any; 
  label: string; 
  isActive: boolean; 
  onClick: () => void;
  badge?: string;
}) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 px-3 py-6 h-auto font-medium relative",
        isActive 
          ? "bg-gradient-to-r from-amber-500/10 to-amber-600/20 text-amber-400 hover:from-amber-500/15 hover:to-amber-600/25" 
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "h-8 w-8 rounded-md flex items-center justify-center",
        isActive 
          ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white" 
          : "bg-slate-800 text-slate-400"
      )}>
        <Icon className="h-4 w-4" />
      </div>
      <span>{label}</span>
      {badge && (
        <Badge className="ml-auto bg-amber-500 hover:bg-amber-600 text-slate-950">
          {badge}
        </Badge>
      )}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-500 rounded-r-full" />
      )}
    </Button>
  )
}
