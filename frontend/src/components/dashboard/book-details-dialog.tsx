"use client"

import { useState } from "react"
import Image from "next/image"
import { BookPlus, Calendar, User, Hash, BookOpen, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"

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

interface BookDetailsDialogProps {
  book: Book
  onBorrow?: () => void
  trigger?: React.ReactNode
}

const BookDetailsContent = ({ book }: { book: Book }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <div className="relative h-64 w-full overflow-hidden rounded-lg bg-slate-800">
        {book.bookImage ? (
          <Image src={book.bookImage} alt={book.title} fill className="object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600">
            <BookPlus className="h-16 w-16 text-white" />
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-300"><User className="h-4 w-4" /><span>{book.author}</span></div>
        <div className="flex items-center gap-2 text-slate-300"><Bookmark className="h-4 w-4" /><Badge className="bg-slate-800 text-slate-300 hover:bg-slate-700">{book.genre}</Badge></div>
        <div className="flex items-center gap-2 text-slate-300"><Hash className="h-4 w-4" /><span>ISBN: {book.bookDetails}</span></div>
        <div className="flex items-center gap-2 text-slate-300"><Calendar className="h-4 w-4" /><span>Added: {new Date(book.created_at).toLocaleDateString()}</span></div>
        <div className="flex items-center gap-2"><Badge className={`${book.quantity > 10 ? "bg-emerald-500/20 text-emerald-400" : book.quantity > 0 ? "bg-amber-500/20 text-amber-400" : "bg-rose-500/20 text-rose-400"}`}>{book.quantity} available</Badge></div>
      </div>
    </div>
    <div className="mt-6">
      <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><BookOpen className="h-5 w-5" />Summary</h4>
      <p className="text-slate-300 leading-relaxed">{book.bookSummary || "No summary available for this book."}</p>
    </div>
  </>
)

export const BookDetailsDialog = ({ book, onBorrow, trigger }: BookDetailsDialogProps) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useUser()

  const handleBorrow = async () => {
    if (book.quantity <= 0) {
      toast.error("This book is currently not available for borrowing")
      return
    }
    const clerkID = user?.id
    console.log("Borrow Now clicked :", book.id, "clerkID:", clerkID)
    const response = await axios.post("http://localhost:3000/api/admin/requestBook",
      {
        bookID: book.id,
        clerkID: clerkID
      }
    )
    console.log("Response : ", response)

    setIsLoading(true)
    try {
      toast.success("Book borrowed successfully!")
      setOpen(false)
      onBorrow?.()
    } catch (error) {
      toast.error("Failed to borrow book")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">{book.title}</DialogTitle>
        </DialogHeader>
        <BookDetailsContent book={book} />
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">Close</Button>
          <Button onClick={handleBorrow} disabled={isLoading || book.quantity <= 0} className={`${book.quantity > 0 ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700" : "bg-slate-700 cursor-not-allowed"} text-white`} data-borrow-id={book.id}>
            {isLoading ? (<div className="flex items-center gap-2"><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /><span>Processing...</span></div>) : (<>{book.quantity > 0 ? "Borrow Now" : "Not Available"}</>)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 