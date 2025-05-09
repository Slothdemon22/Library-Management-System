"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Image from "next/image"
import { format, parseISO } from "date-fns"
import { Edit, Trash2, BookPlus, ArrowDownAZ, Search, Filter, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { EditBookDialog } from "./edit-book-dialog"
import { DeleteBookDialog } from "./delete-book-dialog"

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
}

interface ApiResponse {
  success: boolean
  data: Book[]
}

// Separate component for the book table row to prevent unnecessary re-renders
const BookRow = ({ book, index, onUpdate }: { 
  book: Book; 
  index: number; 
  onUpdate: () => void;
}) => {
  const formatDate = useCallback((dateString: string) => {
    try {
      const date = parseISO(dateString)
      return format(date, "MMM dd yyyy")
    } catch (error) {
      return "Invalid date"
    }
  }, [])

  return (
    <tr 
      className={`border-b border-slate-800/50 hover:bg-slate-800/20 ${
        index % 2 === 0 ? 'bg-slate-800/10' : 'bg-transparent'
      }`}
    >
      <td className="py-4 px-4">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-md bg-slate-800">
            {book.bookImage ? (
              <Image
                src={book.bookImage}
                alt={book.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600">
                <BookPlus className="h-8 w-8 text-white" />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-white">{book.title}</p>
            <p className="text-sm text-slate-400">ISBN: {book.bookDetails}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-slate-300">{book.author}</td>
      <td className="py-4 px-4">
        <Badge className="bg-slate-800 text-slate-300 hover:bg-slate-700">
          {book.genre}
        </Badge>
      </td>
      <td className="py-4 px-4 text-slate-300">{formatDate(book.created_at)}</td>
      <td className="py-4 px-4">
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
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <EditBookDialog book={book} onBookUpdated={onUpdate} />
          <DeleteBookDialog 
            bookId={book.id} 
            bookTitle={book.title} 
            onBookDeleted={onUpdate} 
          />
        </div>
      </td>
    </tr>
  )
}

// Separate component for the empty state
const EmptyState = ({ searchQuery, onClearSearch }: { 
  searchQuery: string; 
  onClearSearch: () => void;
}) => (
  <Card className="bg-slate-900/50 border-slate-800/70 text-white shadow-md p-12 text-center">
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center">
        <BookPlus className="h-8 w-8 text-slate-500" />
      </div>
      <h3 className="text-xl font-medium text-slate-300">
        {searchQuery ? `No books found matching "${searchQuery}"` : "No books found"}
      </h3>
      <p className="text-slate-400 max-w-md">
        {searchQuery 
          ? "Try adjusting your search terms or clear the search to see all books." 
          : "Your library is empty. Add some books to get started."}
      </p>
      {searchQuery && (
        <Button 
          variant="outline" 
          onClick={onClearSearch}
          className="mt-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          Clear Search
        </Button>
      )}
    </div>
  </Card>
)

export default function DashboardOptions() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchBooks = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("http://localhost:3000/api/books/getbooks")

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      if (data.success && data.data) {
        setBooks(data.data)
      } else {
        throw new Error("Invalid data format received")
      }

      setError(null)
    } catch (err) {
      console.error("Failed to fetch books:", err)
      setError("Failed to load books. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const handleClearSearch = useCallback(() => {
    setSearchQuery("")
  }, [])

  // Filter books based on search query
  const filteredBooks = useMemo(() => {
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [books, searchQuery])

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Books Collection</h1>
          <p className="text-slate-400 text-sm">Manage your library's book collection</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800 hover:text-amber-400">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950">
            <Plus className="mr-2 h-4 w-4" /> Add New Book
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by title, author or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-slate-800/50 border-slate-700 text-white focus-visible:ring-amber-500 w-full"
          />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800 hover:text-amber-400">
            <ArrowDownAZ className="mr-2 h-4 w-4" /> Sort by Title
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-rose-900/30 border border-rose-700 text-rose-200 px-4 py-3 rounded-lg relative my-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!isLoading && !error && filteredBooks.length === 0 && (
        <EmptyState searchQuery={searchQuery} onClearSearch={handleClearSearch} />
      )}

      {!isLoading && !error && filteredBooks.length > 0 && (
        <Card className="bg-slate-900/50 border-slate-800/70 text-white shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800">
                  <th className="text-left py-4 px-4 font-medium text-slate-300">Book Title</th>
                  <th className="text-left py-4 px-4 font-medium text-slate-300">Author</th>
                  <th className="text-left py-4 px-4 font-medium text-slate-300">Category</th>
                  <th className="text-left py-4 px-4 font-medium text-slate-300">Date Added</th>
                  <th className="text-left py-4 px-4 font-medium text-slate-300">Quantity</th>
                  <th className="text-left py-4 px-4 font-medium text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book, index) => (
                  <BookRow
                    key={book.id}
                    book={book}
                    index={index}
                    onUpdate={fetchBooks}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  )
}
