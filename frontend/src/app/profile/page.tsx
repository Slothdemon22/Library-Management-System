"use client"

import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, Mail, User, Bookmark, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/db"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function ProfilePage() {
  const { isSignedIn, user, isLoaded } = useUser()
  const [userData, setUserData] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [borrowedBooks, setBorrowedBooks] = useState<any[]>([])
  const [borrowedLoading, setBorrowedLoading] = useState(false)
  const [borrowedError, setBorrowedError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return

    if (!isSignedIn) {
      router.push("/sign-in")
      return
    }

    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("userTable")
        .select("*")
        .eq("clerkID", user?.id)
        .single()

      if (!error && data) {
        setUserData(data)
        setIsAdmin(data.isadmin)
      }
    }

    fetchUserData()
  }, [isLoaded, isSignedIn, user, router])

  // Fetch borrowed books on page load (and when user changes)
  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      if (!user?.id) return
      setBorrowedLoading(true)
      setBorrowedError(null)
      try {
        const res = await axios.post("http://localhost:3000/api/auth/getUserBorrowedBooks", { clerkID: user.id })
        // Ensure uniqueness by bookID
        const uniqueBooks = Array.from(
          new Map(res.data.data.map((b: any) => [b.bookID, b])).values()
        )
        setBorrowedBooks(uniqueBooks)
      } catch (err) {
        setBorrowedError("Failed to fetch borrowed books.")
      } finally {
        setBorrowedLoading(false)
      }
    }
    fetchBorrowedBooks()
  }, [user])

  // Calculate stats
  const totalBorrowed = borrowedBooks.length
  const currentlyReading = borrowedBooks.filter(
    (b) => {
      // If returnDate is in the future or not set, consider as currently reading
      if (!b.returnDate) return true
      return new Date(b.returnDate) > new Date()
    }
  ).length

  if (!isLoaded || !userData) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-slate-800 rounded-lg"></div>
          <div className="h-64 bg-slate-800 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50">
      <div className="container mx-auto px-4 pt-32 pb-16">
        {/* Profile Header */}
        <Card className="mb-8 border-slate-800 bg-slate-900/50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName || "Profile"}
                  className="h-20 w-20 rounded-full object-cover border-4 border-amber-500/30 bg-slate-800"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
              )}
              <div>
                <CardTitle className="text-2xl font-bold text-white">{userData.fullName}</CardTitle>
                <CardDescription className="text-slate-400 flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {userData.emailAddress}
                </CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  {isAdmin && (
                    <Badge className="bg-amber-500 text-slate-950">Admin</Badge>
                  )}
                  <Badge variant="outline" className="border-slate-700 text-slate-400">
                    Member since {new Date(userData.created_at).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-slate-800">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-slate-800 text-slate-300 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="books" 
              className="data-[state=active]:bg-slate-800 text-slate-300 data-[state=active]:text-white"
            >
              Borrowed Books
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-slate-800 text-slate-300 data-[state=active]:text-white"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-white">Reading Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-slate-400">Books Borrowed</p>
                      <p className="text-2xl font-bold text-white">{totalBorrowed}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-400">Currently Reading</p>
                      <p className="text-2xl font-bold text-white">{currentlyReading}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-white">Account Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Bookmark className="h-4 w-4" />
                      <span>Member ID: {userData.clerkID}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span>Joined: {new Date(userData.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="books">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white">Borrowed Books</CardTitle>
                <CardDescription>Your current and past borrowed books</CardDescription>
              </CardHeader>
              <CardContent>
                {borrowedLoading ? (
                  <div className="text-center py-12 text-slate-400">Loading borrowed books...</div>
                ) : borrowedError ? (
                  <div className="text-center py-12 text-rose-400">{borrowedError}</div>
                ) : borrowedBooks.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                    <h3 className="text-lg font-medium">No books borrowed yet</h3>
                    <p className="text-sm text-slate-500 mt-2">Start exploring our collection to borrow your first book!</p>
                    <Button className="mt-6 bg-amber-500 hover:bg-amber-600 text-white" onClick={() => router.push("/bookDetails")}>Browse Books</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {borrowedBooks.map((borrow) => (
                      <Card
                        key={borrow.bookID}
                        className="group bg-slate-900/80 border-slate-800 shadow-lg rounded-xl overflow-hidden transition-transform hover:scale-[1.025] hover:shadow-amber-500/20"
                      >
                        <div className="flex flex-col md:flex-row gap-0 md:gap-4 items-stretch h-full">
                          <div className="relative h-48 md:h-auto md:w-32 w-full flex-shrink-0 overflow-hidden bg-slate-800">
                            {borrow.bookDetails?.bookImage ? (
                              <img
                                src={borrow.bookDetails.bookImage}
                                alt={borrow.bookDetails.title}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <BookOpen className="h-12 w-12 text-slate-500 mx-auto my-auto" />
                            )}
                          </div>
                          <div className="flex-1 flex flex-col justify-between p-4">
                            <div>
                              <h4 className="font-semibold text-white text-lg mb-1 line-clamp-2">{borrow.bookDetails?.title}</h4>
                              <p className="text-slate-400 text-sm mb-1 line-clamp-1">{borrow.bookDetails?.author}</p>
                              <Badge className="bg-slate-800 text-slate-300 mb-2">{borrow.bookDetails?.genre}</Badge>
                            </div>
                            <div className="mt-2 text-xs text-slate-400 space-y-1">
                              <div>
                                <span className="font-medium text-slate-300">Borrowed:</span> {borrow.borrowDate ? new Date(borrow.borrowDate).toLocaleDateString() : "-"}
                              </div>
                              <div>
                                <span className="font-medium text-slate-300">Return:</span> {borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString() : "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white">Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white">Email Notifications</p>
                      <p className="text-sm text-slate-400">Receive updates about your borrowed books</p>
                    </div>
                    <Button variant="outline" className="border-slate-700">
                      Enable
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-white">Reading Preferences</p>
                      <p className="text-sm text-slate-400">Set your preferred genres and authors</p>
                    </div>
                    <Button variant="outline" className="border-slate-700">
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 