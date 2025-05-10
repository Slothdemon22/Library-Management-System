"use client"

import { useState, useEffect } from "react"
import { Search, Filter, BookOpen, ChevronRight, Heart, BookMarked, BookPlus } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@clerk/nextjs"
import { supabase } from "@/lib/db"
import { BookDetailsDialog } from "@/components/dashboard/book-details-dialog"

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
  const { isSignedIn, user } = useUser()
  const [activeView, setActiveView] = useState("grid")

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase.from("bookTable").select("*").order("created_at", { ascending: false })

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

  // Get featured books (top 5 with highest quantity)
  const featuredBooks = [...books].sort((a, b) => b.quantity - a.quantity).slice(0, 5)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-amber-500/30 rounded-full animate-ping"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-amber-400 font-medium">Loading library collection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50 ">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-40 px-6">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl"></div>
        </div>

        <div className="container relative z-10 mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="mb-4 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/20">
                Digital Library Collection
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Discover Your Next <span className="text-amber-400">Great Read</span>
              </h1>
              <p className="text-lg text-slate-300 max-w-xl">
                Explore our extensive collection of books across various genres and find your perfect match. From
                classics to contemporary bestsellers.
              </p>
              <div className="relative max-w-xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by title, author, or genre..."
                  className="pl-10 py-6 bg-slate-800/50 border-slate-700 text-white focus-visible:ring-amber-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {genres.slice(0, 5).map((genre) => (
                  <Badge
                    key={genre}
                    className={`cursor-pointer ${selectedGenre === genre ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
                    onClick={() => handleGenreSelect(genre)}
                  >
                    {genre}
                  </Badge>
                ))}
                {genres.length > 5 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge className="bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer">More...</Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white">
                      {genres.slice(5).map((genre) => (
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
                )}
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="relative h-[400px] w-[300px] mx-auto">
                <div className="absolute top-0 right-0 h-[350px] w-[250px] rotate-6 rounded-lg overflow-hidden shadow-2xl shadow-amber-500/10 border border-slate-700">
                  <Image
                    src="/algo.jpeg"
                    alt="Featured Book"
                    width={250}
                    height={350}
                    className="object-cover h-full w-full"
                  />
                </div>
                <div className="absolute top-10 left-0 h-[350px] w-[250px] -rotate-6 rounded-lg overflow-hidden shadow-2xl shadow-amber-500/10 border border-slate-700">
                  <Image
                    src="/database.jpg"
                    alt="Featured Book"
                    width={250}
                    height={350}
                    className="object-cover h-full w-full"
                  />
                </div>
                <div className="absolute top-5 left-10 h-[350px] w-[250px] rounded-lg overflow-hidden shadow-2xl shadow-amber-500/10 border border-slate-700 z-10">
                  <Image
                    src="/operatingsystem.jpg"
                    alt="Featured Book"
                    width={250}
                    height={350}
                    className="object-cover h-full w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      {!loading && !error && books.length > 0 && (
        <section className="container mx-auto py-12 px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Featured Books</h2>
              <p className="text-slate-400">Handpicked selections from our collection</p>
            </div>
            <Button variant="link" className="text-amber-400 hover:text-amber-300">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {featuredBooks.map((book) => (
              <Card
                key={`featured-${book.id}`}
                className="bg-slate-900/50 border-slate-800/70 text-white shadow-xl overflow-hidden hover:border-amber-500/30 transition-colors group"
              >
                <div className="relative group">
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
                    {book.bookImage ? (
                      <Image
                        src={book.bookImage || "/placeholder.svg"}
                        alt={book.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600">
                        <BookPlus className="h-16 w-16 text-white" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-amber-500 text-slate-950">Featured</Badge>
                    </div>
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
                      <Badge className="bg-slate-800 text-slate-300 hover:bg-slate-700 px-3 py-1">{book.genre}</Badge>
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
        </section>
      )}

      {/* Browse Collection */}
      <section className="container mx-auto py-12 px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Browse Collection</h2>
            <p className="text-slate-400 text-sm">
              {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"} available
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex items-center bg-slate-800 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                className={`px-3 ${activeView === "grid" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
                onClick={() => setActiveView("grid")}
              >
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-2 h-2 bg-current rounded-sm"></div>
                  <div className="w-2 h-2 bg-current rounded-sm"></div>
                  <div className="w-2 h-2 bg-current rounded-sm"></div>
                  <div className="w-2 h-2 bg-current rounded-sm"></div>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`px-3 ${activeView === "list" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
                onClick={() => setActiveView("list")}
              >
                <div className="flex flex-col gap-1">
                  <div className="w-6 h-1 bg-current rounded-sm"></div>
                  <div className="w-6 h-1 bg-current rounded-sm"></div>
                  <div className="w-6 h-1 bg-current rounded-sm"></div>
                </div>
              </Button>
            </div>
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

        {!loading && !error && filteredBooks.length > 0 && activeView === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <Card
                key={book.id}
                className="bg-slate-900/50 border-slate-800/70 text-white shadow-xl overflow-hidden hover:border-amber-500/30 transition-colors group"
              >
                <div className="relative group">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg bg-slate-800">
                    {book.bookImage ? (
                      <Image
                        src={book.bookImage || "/placeholder.svg"}
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
                      <Badge className="bg-slate-800 text-slate-300 hover:bg-slate-700 px-3 py-1">{book.genre}</Badge>
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

        {!loading && !error && filteredBooks.length > 0 && activeView === "list" && (
          <div className="space-y-4">
            {filteredBooks.map((book) => (
              <Card
                key={book.id}
                className="bg-slate-900/50 border-slate-800/70 text-white shadow-xl overflow-hidden hover:border-amber-500/30 transition-colors group"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative sm:w-[150px] aspect-[3/4] sm:aspect-auto overflow-hidden bg-slate-800">
                    {book.bookImage ? (
                      <Image
                        src={book.bookImage || "/placeholder.svg"}
                        alt={book.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600">
                        <BookPlus className="h-16 w-16 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="font-medium text-white text-xl">{book.title}</h3>
                        <p className="text-slate-400">{book.author}</p>
                        <div className="flex flex-wrap gap-2 my-3">
                          <Badge className="bg-slate-800 text-slate-300 hover:bg-slate-700">{book.genre}</Badge>
                          <Badge
                            className={`${
                              book.quantity > 10
                                ? "bg-emerald-500/20 text-emerald-400"
                                : book.quantity > 0
                                  ? "bg-amber-500/20 text-amber-400"
                                  : "bg-rose-500/20 text-rose-400"
                            }`}
                          >
                            {book.quantity} available
                          </Badge>
                          {book.publicationYear && (
                            <Badge className="bg-slate-800 text-slate-300">{book.publicationYear}</Badge>
                          )}
                        </div>
                        {book.bookSummary && (
                          <p className="text-sm text-slate-300 line-clamp-2 mt-2">{book.bookSummary}</p>
                        )}
                      </div>
                      <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0">
                        <BookDetailsDialog
                          book={book}
                          onBorrow={fetchBooks}
                          trigger={
                            <Button variant="secondary" className="bg-amber-500 hover:bg-amber-600 text-slate-950">
                              View Details
                            </Button>
                          }
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
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
