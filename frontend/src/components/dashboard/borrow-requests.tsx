"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { format, addDays, parseISO } from "date-fns"
import { Check, ChevronDown, BookOpen, Filter, Calendar, Clock, Loader2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"

// Define types based on the provided data structure
interface User {
  clerkID: string
  isadmin: boolean
  fullName: string
  imageUrl: string
  created_at: string
  emailAddress: string
}

interface Book {
  id: number
  genre: string
  title: string
  author: string
  quantity: number
  bookImage: string
  created_at: string
  bookDetails: string
  bookSummary: string
}

interface BorrowRequest {
  created_at: string
  bookID: number
  requestDate: string
  borrowRequestID: number
  status: string
  clerkID: string
  user: User
  book: Book
}

export default function BorrowRequests() {
  const [requests, setRequests] = useState<BorrowRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeRow, setActiveRow] = useState<number | null>(null)
  const { user } = useUser()
  const [statusLoadingId, setStatusLoadingId] = useState<number | null>(null)

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get("http://localhost:3000/api/admin/getRequests")
        setRequests(res.data.requests)
      } catch (err) {
        setError("Failed to fetch requests.")
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [])

  // Function to calculate return date (borrow date + 20 days)
  const calculateReturnDate = (borrowDate: string) => {
    if (!borrowDate) return new Date()
    
    try {
      const date = parseISO(borrowDate)
      return addDays(date, 20)
    } catch (error) {
      console.error("Error parsing date:", error)
      return new Date()
    }
  }

  // Function to format date with error handling
  const formatDate = (dateString: string) => {
    if (!dateString) return "No date"
    
    try {
      const date = parseISO(dateString)
      return format(date, "MMM dd yyyy")
    } catch (error) {
      console.error("Error formatting date:", error, dateString)
      return "Invalid date"
    }
  }

  // Function to update request status
  const updateStatus = async (requestId: number, newStatus: string) => {
    setStatusLoadingId(requestId)
    try {
      const request = requests.find(r => r.borrowRequestID === requestId)
      const bookID = request?.bookID
      const clerkID = user?.id
      console.log("Updating status : ", requestId, newStatus, "bookID:", bookID, "clerkID:", clerkID)
      // Call API to update status
      const response = await fetch(`http://localhost:3000/api/admin//updateBorrowStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          borrowRequestID: requestId,
          status: newStatus,
          bookID,
          clerkID
        }),
      })

      if (!response.ok) {
        toast.error("Failed to update status. Please try again.")
        throw new Error(`Failed to update status: ${response.status}`)
      }

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.borrowRequestID === requestId ? { ...request, status: newStatus as any } : request,
        ),
      )
      toast.success(`Status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)} for request #${requestId}`)
      console.log(`Status updated to ${newStatus} for request ${requestId}`)
    } catch (error) {
      toast.error("An error occurred while updating the status. Please try again later.")
      console.error("Error updating status:", error)
    }
    setStatusLoadingId(null)
    setActiveRow(null)
  }

  // Get status color class
  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "borrowed":
        return "text-amber-400 bg-amber-500/10"
      case "returned":
        return "text-emerald-400 bg-emerald-500/10"
      case "late return":
        return "text-rose-400 bg-rose-500/10"
      default:
        return "text-blue-400 bg-blue-500/10"
    }
  }

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "borrowed":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20">Borrowed</Badge>
      case "returned":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Returned</Badge>
      case "late return":
        return <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/20">Late Return</Badge>
      default:
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Requested</Badge>
    }
  }

  // Add the handler function:
  const handleStatusChange = async (requestId: number, newStatus: string) => {
    switch (newStatus) {
      case "borrowed":
        console.log(`Admin changed status for request ${requestId} to ${newStatus}`);
        await updateStatus(requestId, newStatus);
        break;
      case "returned":
      case "late return":
        console.log(`Status change to '${newStatus}' for request ${requestId} (no backend call, as per requirements).`);
        // You can add logic here in the future if needed
        break;
      default:
        console.log(`Unhandled status: ${newStatus} for request ${requestId}`);
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading borrow requests...</div>
  }
  if (error) {
    return <div className="p-8 text-center text-rose-400">{error}</div>
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Book Borrowing Requests</h1>
          <p className="text-slate-400 text-sm">Manage and track all book borrowing requests</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800 hover:text-amber-400">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950">
            <BookOpen className="mr-2 h-4 w-4" /> View All Books
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-slate-900/50 border-slate-800/70 text-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-blue-500/20 flex items-center justify-center text-blue-400">
                <Clock className="h-4 w-4" />
              </div>
              Pending Requests
            </CardTitle>
            <CardDescription className="text-slate-400">
              Awaiting approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-400">
              {requests.filter(r => r.status?.toLowerCase() === "requested").length || 0}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-800/70 text-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-amber-500/20 flex items-center justify-center text-amber-400">
                <BookOpen className="h-4 w-4" />
              </div>
              Active Borrows
            </CardTitle>
            <CardDescription className="text-slate-400">
              Currently borrowed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-400">
              {requests.filter(r => r.status?.toLowerCase() === "borrowed").length || 0}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-800/70 text-white shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Calendar className="h-4 w-4" />
              </div>
              Returned Books
            </CardTitle>
            <CardDescription className="text-slate-400">
              Successfully returned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-400">
              {requests.filter(r => r.status?.toLowerCase() === "returned").length || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {!loading && !error && requests.length === 0 && (
        <Card className="bg-slate-900/50 border-slate-800/70 text-white shadow-md p-12 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-medium text-slate-300">No borrow requests found</h3>
            <p className="text-slate-400 max-w-md">There are currently no book borrowing requests in the system.</p>
          </div>
        </Card>
      )}

      {!loading && !error && requests.length > 0 && (
        <Card className="bg-slate-900/50 border-slate-800/70 text-white shadow-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-900/80 border-b border-slate-800">
              <TableRow className="hover:bg-slate-900/80">
                <TableHead className="w-[250px] text-slate-300 font-medium">Book</TableHead>
                <TableHead className="w-[250px] text-slate-300 font-medium">User Requested</TableHead>
                <TableHead className="w-[120px] text-slate-300 font-medium">Status</TableHead>
                <TableHead className="w-[120px] text-slate-300 font-medium">Borrowed Date</TableHead>
                <TableHead className="w-[120px] text-slate-300 font-medium">Return Date</TableHead>
                <TableHead className="w-[120px] text-slate-300 font-medium">Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => {
                const returnDate = calculateReturnDate(request.requestDate)
                const isActive = activeRow === request.borrowRequestID

                return (
                  <TableRow key={request.borrowRequestID} className="h-[72px] border-b border-slate-800/50 hover:bg-slate-800/20">
                    {/* Book Column */}
                    <TableCell className="text-white">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 overflow-hidden rounded-md shadow-md">
                          {request.book?.bookImage ? (
                            <Image
                              src={request.book.bookImage || "/placeholder.svg"}
                              alt={request.book.title || "Book cover"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="bg-slate-800 h-12 w-10 flex items-center justify-center">
                              <BookOpen className="h-6 w-6 text-slate-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{request.book?.title || "Unknown Book"}</p>
                          <p className="text-xs text-slate-400">{request.book?.author || "Unknown Author"}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* User Column */}
                    <TableCell className="text-white">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={request.user?.imageUrl || "/placeholder.svg"} alt={request.user?.fullName || "User profile"} />
                          <AvatarFallback>{request.user?.fullName?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{request.user?.fullName || "Unknown User"}</p>
                          <p className="text-xs text-slate-400">{request.user?.emailAddress || "No email"}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Status Column */}
                    <TableCell>
                      <Popover open={isActive} onOpenChange={(open) => !open && setActiveRow(null)}>
                        <PopoverTrigger asChild>
                          <button
                            onClick={() => setActiveRow(request.borrowRequestID)}
                            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium capitalize"
                            disabled={statusLoadingId === request.borrowRequestID}
                          >
                            {statusLoadingId === request.borrowRequestID ? (
                              <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                            ) : (
                              <>
                                {getStatusBadge(request.status)}
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                              </>
                            )}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[180px] p-1 bg-slate-800 border-slate-700 text-white">
                          <div className="flex flex-col py-1">
                            {["Borrowed", "Returned", "Late Return"].map((status) => (
                              <button
                                key={status}
                                className={cn(
                                  "flex items-center justify-between px-4 py-2 text-sm rounded-md hover:bg-slate-700",
                                  request.status?.toLowerCase() === status.toLowerCase() 
                                    ? getStatusClass(status) 
                                    : "text-slate-300"
                                )}
                                onClick={() => handleStatusChange(request.borrowRequestID, status.toLowerCase())}
                              >
                                {status}
                                {request.status?.toLowerCase() === status.toLowerCase() && <Check className="h-4 w-4" />}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>

                    {/* Borrowed Date Column */}
                    <TableCell className="text-slate-300">{formatDate(request.requestDate)}</TableCell>

                    {/* Return Date Column */}
                    <TableCell className="text-slate-300">
                      {request.requestDate ? formatDate(returnDate.toISOString()) : "N/A"}
                    </TableCell>

                    {/* Due Date Column */}
                    <TableCell className="text-slate-300">
                      {request.requestDate ? formatDate(returnDate.toISOString()) : "N/A"}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </>
  )
}
