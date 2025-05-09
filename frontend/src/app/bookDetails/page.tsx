"use client"

import { useState, useEffect } from "react"
import { Search, LogOut, Library, Filter, BookOpen, ChevronRight, Heart, BookMarked, BookPlus } from "lucide-react"
import Image from "next/image"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser, UserButton } from "@clerk/nextjs"
import { supabase } from "@/lib/db"
import { Clock, User } from "lucide-react"
import { BookDetailsDialog } from "@/components/dashboard/book-details-dialog"
import { toast } from "sonner"

// Define the book interface
interface Book {
  id: number
  created_at: string
  title: string
  author: string
  genre: string
  bookImage: string
  bookDetails: string
  quantity: number
  bookSummary: string
  isbn: string
  publicationYear: string
  description: string
  availableCopies: number
}

interface BookResponse {
  success: boolean
  data: Book[]
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [genres, setGenres] = useState<string[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string>("All Genres")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isSignedIn } = useUser()

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from("bookTable")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setBooks(data || [])
      setFilteredBooks(data || [])

      // Extract unique genres from the book data
      const uniqueGenres = Array.from(new Set(data.map((book) => book.genre)))
      setGenres(uniqueGenres)

      setError(null)
    } catch (err) {
      console.error("Error fetching books:", err)
      setError("Failed to fetch books. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  // Filter books when genre or search query changes
  useEffect(() => {
    let result = books

    // Apply genre filter if not "All Genres"
    if (selectedGenre !== "All Genres") {
      result = result.filter((book) => book.genre === selectedGenre)
    }

    // Apply search filter if there's a search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.genre.toLowerCase().includes(query),
      )
    }

    setFilteredBooks(result)
  }, [selectedGenre, searchQuery, books])

  // Handle genre selection
  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-slate-800 bg-slate-900/50 animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-800 rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-4 bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-800 rounded w-2/3 mt-2"></div>
              </CardContent>
              <CardFooter>
                <div className="h-8 bg-slate-800 rounded w-1/3"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Library className="h-6 w-6 text-amber-400" />
              <span className="text-xl font-bold text-white">BookWise</span>
            </div>
            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <Button
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                  onClick={() => window.location.href = "/sign-in"}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-6">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl"></div>
        </div>

        <div className="container relative z-10 mx-auto">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/20">
              Library Collection
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight">
              Discover Your Next <span className="text-amber-400">Great Read</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              Explore our extensive collection of books across various genres and find your perfect match.
            </p>
            <div className="mt-8 relative mx-auto max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by title, author, or genre..."
                className="pl-10 py-6 bg-slate-800/50 border-slate-700 text-white focus-visible:ring-amber-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <section className="container mx-auto py-8 px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Browse Collection</h2>
            <p className="text-slate-400 text-sm">
              {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"} available
            </p>
          </div>
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800 hover:text-amber-400"
                >
                  <Filter className="mr-2 h-4 w-4" /> {selectedGenre}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white w-56">
                <DropdownMenuItem
                  onClick={() => handleGenreSelect("All Genres")}
                  className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                >
                  All Genres
                </DropdownMenuItem>
                {genres.map((genre) => (
                  <DropdownMenuItem
                    key={genre}
                    onClick={() => handleGenreSelect(genre)}
                    className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                  >
                    {genre}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {error && (
          <Card className="bg-rose-900/30 border-rose-700 text-rose-200 p-6 text-center">
            <p>{error}</p>
            <Button
              variant="outline"
              className="mt-4 border-rose-700 text-rose-200 hover:bg-rose-900/50"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </Card>
        )}

        {!loading && !error && filteredBooks.length === 0 && (
          <Card className="bg-slate-900/50 border-slate-800/70 text-white shadow-md p-12 text-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-medium text-slate-300">No books found</h3>
              <p className="text-slate-400 max-w-md">
                {searchQuery || selectedGenre !== "All Genres"
                  ? "Try adjusting your search criteria to find more books."
                  : "There are no books in the library collection yet."}
              </p>
              {(searchQuery || selectedGenre !== "All Genres") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedGenre("All Genres")
                  }}
                  className="mt-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </Card>
        )}

        {!loading && !error && filteredBooks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <Card
                key={book.id}
                className="bg-slate-900/50 border-slate-800/70 text-white shadow-xl overflow-hidden hover:border-amber-500/30 transition-colors group"
              >
                <div className="relative group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-slate-800">
                    {book.bookImage ? (
                      <Image
                        src={book.bookImage}
                        alt={book.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600">
                        <BookPlus className="h-16 w-16 text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex flex-col gap-3">
                        <BookDetailsDialog 
                          book={book} 
                          onBorrow={fetchBooks}
                          trigger={
                            <Button 
                              variant="secondary" 
                              className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm px-6"
                            >
                              View Details
                            </Button>
                          }
                        />
                        
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium text-white text-lg line-clamp-1">{book.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-1">{book.author}</p>
                    </div>
                    <div className="space-y-3">
                      <Badge className="bg-slate-800 text-slate-300 hover:bg-slate-700 px-3 py-1">
                        {book.genre}
                      </Badge>
                      <Badge 
                        className={`${
                          book.quantity > 10 
                            ? "bg-emerald-500/20 text-emerald-400" 
                            : book.quantity > 0 
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-rose-500/20 text-rose-400"
                        } px-3 py-1 block`}
                      >
                        {book.quantity} available
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && !error && filteredBooks.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950">
              Load More <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </section>

    
    </div>
  )
}

// Featured Collection Component
function FeaturedCollection({
  title,
  description,
  count,
  image,
}: {
  title: string
  description: string
  count: number
  image: string
}) {
  return (
    <Card className="bg-slate-900/50 border-slate-800/70 text-white shadow-xl overflow-hidden hover:border-amber-500/30 transition-colors group">
      <div className="relative h-40 overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent flex items-center justify-center">
          <div className="p-6 text-center">
            <h3 className="font-bold text-xl mb-1 group-hover:text-amber-400 transition-colors">{title}</h3>
            <p className="text-sm text-slate-300 mb-3">{description}</p>
            <Badge className="bg-amber-500/90 text-slate-950 hover:bg-amber-600">{count} Books</Badge>
          </div>
        </div>
      </div>
      <CardFooter className="p-4 flex justify-between items-center">
        <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white">
          <BookMarked className="mr-2 h-4 w-4" /> Browse Collection
        </Button>
      </CardFooter>
    </Card>
  )
}
