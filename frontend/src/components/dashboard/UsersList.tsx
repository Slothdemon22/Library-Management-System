"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { format, parseISO } from "date-fns"
import { Check, X, Search, UserPlus, ArrowUpDown, ArrowUp, ArrowDown, Shield, UserIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs" // Import the useUser hook from Clerk

interface User {
  clerkID: string
  created_at: string
  fullName: string
  emailAddress: string
  isadmin: boolean
  imageUrl: string
}

type SortOrder = "asc" | "desc" | "none"

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmingUser, setConfirmingUser] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<SortOrder>("none")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Get current user info from Clerk
  const { user: currentUser, isLoaded } = useUser()

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("http://localhost:3000/api/auth/getusers")

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()
        if (isMounted) {
          setUsers(data.data || [])
          setError(null)
        }
      } catch (err) {
        console.error("Failed to fetch users:", err)
        if (isMounted) {
          setError("Failed to load users. Please try again later.")
          setUsers([]) // Reset users on error
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchUsers()

    // Cleanup function to prevent setting state after component unmounts
    return () => {
      isMounted = false
    }
  }, [])

  // Filter and sort users based on search query and sort order
  const filteredAndSortedUsers = useMemo(() => {
    // First filter by search query
    let result = users.filter((user) => {
      // Check if user.fullName exists before calling toLowerCase()
      return user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    })

    // Then sort by date joined if sort order is specified
    if (sortOrder !== "none") {
      result = [...result].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime()
        const dateB = new Date(b.created_at).getTime()
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA
      })
    }

    return result
  }, [users, searchQuery, sortOrder])

  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return format(date, "MMM dd yyyy")
    } catch (error) {
      return "Invalid date"
    }
  }

  // Function to toggle admin status and send request to API
  const toggleAdminStatus = async (userId: string, userName: string, currentStatus: boolean) => {
    // Only proceed if we have the current user's info
    if (!isLoaded || !currentUser) {
      toast.error("User authentication error", {
        description: "You must be logged in to perform this action.",
      })
      return
    }

    try {
      setIsSubmitting(true)
      
      // Optimistically update UI
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.clerkID === userId ? { ...user, isadmin: !user.isadmin } : user))
      )
      console.log("userId : ", userId)
      console.log("currentStatus : ", currentStatus)
      
      // Send request to the API endpoint
      const response = await fetch(`http://localhost:3000/api/admin/makeAdmin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isadmin: !currentStatus, // Toggle the current status
          clerkID: userId
        })
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      
      // Show success message
      toast.success(`Role Updated`, {
        description: `${userName}'s role has been changed to ${currentStatus ? "User" : "Admin"}.`,
      })
      
    } catch (err) {
      console.error("Failed to update user role:", err)
      
      // Revert the optimistic update if the API call fails
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.clerkID === userId ? { ...user, isadmin: currentStatus } : user))
      )
      
      toast.error("Update Failed", {
        description: "Failed to update user role. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
      setConfirmingUser(null)
    }
  }

  // Function to get initials from name
  const getInitials = (name: string) => {
    if (!name) return "??"

    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("")
  }

  // Function to handle sort order change
  const handleSortChange = (value: string) => {
    setSortOrder(value as SortOrder)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">User Management</h1>
          <p className="text-slate-400 text-sm">Manage users and their roles in the system</p>
        </div>
        <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950">
          <UserPlus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-slate-900/50 border-slate-800/70 text-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-blue-500/20 flex items-center justify-center text-blue-400">
                <UserIcon className="h-4 w-4" />
              </div>
              Regular Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-400">{users.filter((user) => !user.isadmin).length || 0}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800/70 text-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Shield className="h-4 w-4" />
              </div>
              Administrators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-400">{users.filter((user) => user.isadmin).length || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-slate-800/50 border-slate-700 text-white focus-visible:ring-amber-500 w-full"
          />
        </div>
        <Tabs defaultValue="none" onValueChange={handleSortChange} className="w-full md:w-auto">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400 flex items-center whitespace-nowrap">
              <ArrowUpDown className="h-4 w-4 mr-1" /> Sort by Date:
            </span>
            <TabsList className="bg-slate-800/50 border border-slate-700">
              <TabsTrigger value="none" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                Default
              </TabsTrigger>
              <TabsTrigger value="asc" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <ArrowUp className="h-3.5 w-3.5 mr-1" /> Oldest
              </TabsTrigger>
              <TabsTrigger value="desc" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950">
                <ArrowDown className="h-3.5 w-3.5 mr-1" /> Newest
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      )}

      {error && (
        <div
          className="bg-rose-900/30 border border-rose-700 text-rose-200 px-4 py-3 rounded-lg relative my-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!isLoading && !error && filteredAndSortedUsers.length === 0 && (
        <Card className="bg-slate-900/50 border-slate-800/70 text-white shadow-md p-12 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-medium text-slate-300">
              {searchQuery ? `No users found matching "${searchQuery}"` : "No users found"}
            </h3>
            <p className="text-slate-400 max-w-md">
              {searchQuery
                ? "Try adjusting your search terms or clear the search to see all users."
                : "There are no users in the system yet."}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="mt-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Clear Search
              </Button>
            )}
          </div>
        </Card>
      )}

      {!isLoading && !error && filteredAndSortedUsers.length > 0 && (
        <Card className="bg-slate-900/50 border-slate-800/70 text-white shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800">
                  <th className="text-left py-4 px-6 font-medium text-slate-300">Name</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-300">Email</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-300">Date Joined</th>
                  <th className="text-left py-4 px-6 font-medium text-slate-300">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedUsers.map((user, index) => (
                  <tr
                    key={user.clerkID}
                    className={`border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors ${
                      index % 2 === 0 ? "bg-slate-800/10" : "bg-transparent"
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-amber-500 to-amber-600 shadow-md flex items-center justify-center">
                          {user.imageUrl ? (
                            <Image
                              src={user.imageUrl || "/placeholder.svg"}
                              alt={user.fullName || "User"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-white font-bold text-sm">{getInitials(user.fullName)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.fullName || "Unnamed User"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-300">{user.emailAddress || "No email"}</td>
                    <td className="py-4 px-6 text-slate-300">{formatDate(user.created_at)}</td>
                    <td className="py-4 px-6">
                      <Popover
                        open={confirmingUser === user.clerkID}
                        onOpenChange={(open) => !open && setConfirmingUser(null)}
                      >
                        <PopoverTrigger asChild>
                          <button
                            onClick={() => setConfirmingUser(user.clerkID)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                              user.isadmin
                                ? "bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-400 hover:from-amber-500/30 hover:to-amber-600/30"
                                : "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 hover:from-blue-500/30 hover:to-blue-600/30"
                            }`}
                          >
                            {user.isadmin ? "Admin" : "User"}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0 bg-slate-800 border-slate-700 text-white rounded-lg shadow-xl">
                          <div className="p-4 border-b border-slate-700 bg-slate-800/80">
                            <h3 className="font-semibold text-lg">Confirm Role Change</h3>
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-slate-300 mb-6">
                              Are you sure you want to change{" "}
                              <span className="font-medium text-white">{user.fullName || "this user"}'s</span> role from{" "}
                              <span className={`font-medium ${user.isadmin ? "text-amber-400" : "text-blue-400"}`}>
                                {user.isadmin ? "Admin" : "User"}
                              </span>{" "}
                              to{" "}
                              <span className={`font-medium ${user.isadmin ? "text-blue-400" : "text-amber-400"}`}>
                                {user.isadmin ? "User" : "Admin"}
                              </span>
                              ?
                            </p>
                            <div className="flex justify-end gap-3">
                              <Button
                                onClick={() => setConfirmingUser(null)}
                                variant="outline"
                                className="border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                                disabled={isSubmitting}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                              <Button
                                onClick={() =>
                                  toggleAdminStatus(user.clerkID, user.fullName || "Unnamed User", user.isadmin)
                                }
                                className="bg-amber-500 hover:bg-amber-600 text-slate-950"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <>
                                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-slate-900 border-t-transparent rounded-full"></div>
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Confirm
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  )
}