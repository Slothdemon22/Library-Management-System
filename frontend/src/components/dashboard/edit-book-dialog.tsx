"use client"

import { useState } from "react"
import { Edit, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

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

interface EditBookDialogProps {
  book: Book
  onBookUpdated: () => void
}

const GENRE_OPTIONS = [
  "Classic",
  "Fiction",
  "Dystopian",
  "Coming-of-Age",
  "History",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Romance",
  "Biography",
  "Non-Fiction",
  "Poetry",
  "Drama",
  "Horror",
  "Adventure"
]

export const EditBookDialog = ({ book, onBookUpdated }: EditBookDialogProps) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Book>>({
    title: book.title,
    author: book.author,
    genre: book.genre,
    bookImage: book.bookImage,
    bookDetails: book.bookDetails,
    quantity: book.quantity,
    bookSummary: book.bookSummary,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Log form submission data
    console.log("Form submission data:", {
      id: book.id,
      ...formData,
    })

    try {
      const response = await fetch("http://localhost:3000/api/books/editbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: book.id,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update book")
      }

      toast.success("Book Updated", {
        description: `"${formData.title}" has been updated successfully.`,
      })
      setOpen(false)
      onBookUpdated()
    } catch (error) {
      console.error("Error updating book:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update book")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number.parseInt(value) : value,
    }))
  }

  const handleGenreChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      genre: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-400" />
            Edit Book
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Make changes to the book information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                className="bg-slate-800 border-slate-700 text-white focus-visible:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author" className="text-white">
                Author
              </Label>
              <Input
                id="author"
                name="author"
                value={formData.author || ""}
                onChange={handleChange}
                className="bg-slate-800 border-slate-700 text-white focus-visible:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre" className="text-white">
                Genre
              </Label>
              <Select
                value={formData.genre}
                onValueChange={handleGenreChange}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:ring-blue-500">
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  {GENRE_OPTIONS.map((genre) => (
                    <SelectItem
                      key={genre}
                      value={genre}
                      className="focus:bg-slate-700 focus:text-white"
                    >
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-white">
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={formData.quantity || 0}
                onChange={handleChange}
                className="bg-slate-800 border-slate-700 text-white focus-visible:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookImage" className="text-white">
                Image URL
              </Label>
              <Input
                id="bookImage"
                name="bookImage"
                value={formData.bookImage || ""}
                onChange={handleChange}
                className="bg-slate-800 border-slate-700 text-white focus-visible:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookDetails" className="text-white">
                Book Details
              </Label>
              <Input
                id="bookDetails"
                name="bookDetails"
                value={formData.bookDetails || ""}
                onChange={handleChange}
                className="bg-slate-800 border-slate-700 text-white focus-visible:ring-blue-500"
                placeholder="e.g., Hardcover, 180 pages"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="bookSummary" className="text-white">
                Book Summary
              </Label>
              <Textarea
                id="bookSummary"
                name="bookSummary"
                value={formData.bookSummary || ""}
                onChange={handleChange}
                className="bg-slate-800 border-slate-700 text-white focus-visible:ring-blue-500 min-h-[100px] resize-none"
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Saving...</span>
                </div>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 