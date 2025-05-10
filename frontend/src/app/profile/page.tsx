"use client"

import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, Mail, User, Bookmark, Clock, Settings, Bell, Shield, BookOpenCheck, Users, Library, BarChart3, BookMarked, History } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/db"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

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
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-purple-500/20 blur-3xl"></div>
          <Card className="relative border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="relative">
                  {user?.imageUrl ? (
                    <Avatar className="h-28 w-28 border-4 border-amber-500/30">
                      <AvatarImage src={user.imageUrl} alt={user.fullName || "Profile"} />
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-600 text-white text-3xl">
                        {user.fullName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-28 w-28 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                      <User className="h-14 w-14 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2">
                    <Badge className="bg-amber-500 text-slate-950 px-4 py-1.5 text-sm font-medium">
                      {isAdmin ? "Administrator" : "Member"}
                    </Badge>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <CardTitle className="text-4xl font-bold text-white mb-3">{userData.fullName}</CardTitle>
                  <CardDescription className="text-slate-400 flex items-center justify-center md:justify-start gap-2 text-lg">
                    <Mail className="h-5 w-5" />
                    {userData.emailAddress}
                  </CardDescription>
                  <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                    <Badge variant="outline" className="border-slate-700 text-slate-400 px-4 py-1.5">
                      <Calendar className="h-4 w-4 mr-2" />
                      Member since {new Date(userData.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Profile Content */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-slate-900/50 border border-slate-800 p-1.5 rounded-xl">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-slate-800 text-slate-300 data-[state=active]:text-white px-6 py-2.5 rounded-lg"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="books" 
              className="data-[state=active]:bg-slate-800 text-slate-300 data-[state=active]:text-white px-6 py-2.5 rounded-lg"
            >
              <BookMarked className="h-4 w-4 mr-2" />
              My Books
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-slate-800 text-slate-300 data-[state=active]:text-white px-6 py-2.5 rounded-lg"
            >
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-slate-800 text-slate-300 data-[state=active]:text-white px-6 py-2.5 rounded-lg"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-amber-500" />
                    Reading Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-slate-400">Books Borrowed</span>
                        <span className="text-white font-medium">{totalBorrowed}</span>
                      </div>
                      <Progress value={(totalBorrowed / 10) * 100} className="h-2.5 bg-slate-800" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-slate-400">Currently Reading</span>
                        <span className="text-white font-medium">{currentlyReading}</span>
                      </div>
                      <Progress value={(currentlyReading / 5) * 100} className="h-2.5 bg-slate-800" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-amber-500" />
                    Account Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-slate-300">
                      <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                        <Bookmark className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Member ID</p>
                        <p className="font-medium">{userData.clerkID}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300">
                      <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Joined Date</p>
                        <p className="font-medium">{new Date(userData.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                    <Bell className="h-5 w-5 text-amber-500" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <Bell className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="font-medium text-white">Email Notifications</p>
                          <p className="text-sm text-slate-400">Get updates about your books</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-slate-700">
                        Enable
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="books">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-amber-500" />
                  Borrowed Books
                </CardTitle>
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
                    <Button className="mt-6 bg-amber-500 hover:bg-amber-600 text-white" onClick={() => router.push("/bookDetails")}>
                      Browse Books
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {borrowedBooks.map((borrow) => (
                      <Card
                        key={borrow.bookID}
                        className="group bg-slate-900/80 border-slate-800 shadow-lg rounded-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-amber-500/20"
                      >
                        <div className="flex flex-col h-full">
                          <div className="relative h-52 overflow-hidden bg-slate-800">
                            {borrow.bookDetails?.bookImage ? (
                              <img
                                src={borrow.bookDetails.bookImage}
                                alt={borrow.bookDetails.title}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600">
                                <BookOpen className="h-12 w-12 text-white" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                              <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                          <div className="p-6 flex-1 flex flex-col">
                            <h4 className="font-semibold text-white text-lg mb-2 line-clamp-2">{borrow.bookDetails?.title}</h4>
                            <p className="text-slate-400 text-sm mb-3 line-clamp-1">{borrow.bookDetails?.author}</p>
                            <Badge className="bg-slate-800 text-slate-300 mb-4 w-fit">{borrow.bookDetails?.genre}</Badge>
                            <div className="mt-auto space-y-3 text-sm">
                              <div className="flex items-center gap-2 text-slate-400">
                                <Clock className="h-4 w-4" />
                                <span>Borrowed: {borrow.borrowDate ? new Date(borrow.borrowDate).toLocaleDateString() : "-"}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-400">
                                <Calendar className="h-4 w-4" />
                                <span>Return: {borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString() : "-"}</span>
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

          <TabsContent value="history">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                  <History className="h-5 w-5 text-amber-500" />
                  Reading History
                </CardTitle>
                <CardDescription>Track your reading journey and past activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-400">
                  <History className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                  <h3 className="text-lg font-medium">No reading history yet</h3>
                  <p className="text-sm text-slate-500 mt-2">Your reading history will appear here once you start borrowing books</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 text-amber-500" />
                  Account Settings
                </CardTitle>
                <CardDescription>Manage your account preferences and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-5 rounded-xl bg-slate-800/50">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Bell className="h-6 w-6 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Email Notifications</p>
                        <p className="text-sm text-slate-400">Receive updates about your borrowed books</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-slate-700">
                      Enable
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-5 rounded-xl bg-slate-800/50">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Reading Preferences</p>
                        <p className="text-sm text-slate-400">Set your preferred genres and authors</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-slate-700">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-5 rounded-xl bg-slate-800/50">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Shield className="h-6 w-6 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Privacy Settings</p>
                        <p className="text-sm text-slate-400">Manage your privacy and security preferences</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-slate-700">
                      Manage
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