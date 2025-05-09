"use client"

import type React from "react"
import { useState } from "react"
import { Plus, BookOpen, Upload, Check } from 'lucide-react'
import { toast } from "sonner"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useDropzone } from "react-dropzone"
import { supabase } from "@/lib/db" // Import supabase client from the correct location

interface BookFormData {
  title: string
  author: string
  genre: string
  bookImage: string
  bookDetails: string
  quantity: number
  bookSummary: string
}

const initialFormData: BookFormData = {
  title: "",
  author: "",
  genre: "",
  bookImage: "",
  bookDetails: "",
  quantity: 1,
  bookSummary: "",
}

const genres = [
  "Computer Science",
  "Fiction",
  "Science Fiction",
  "Classic Fiction",
  "Mystery",
  "Biography",
  "History",
  "Self-Help",
  "Business",
  "Philosophy",
]

export default function AddBook() {
  const [formData, setFormData] = useState<BookFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleGenreChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      genre: value,
    }))
  }

  const handleFileDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (file) {
      try {
        // Upload the image to Supabase
        const filename= `/${Math.random() * 100 + file.name}`
        const { data, error } = await supabase.storage
          .from('dbproject') // Your bucket name in Supabase
          .upload(`/${filename}`, file)

        if (error) {
          throw new Error(error.message)
        }

        // Get the public URL of the uploaded file
        const { data: urlData } = supabase.storage
          .from('dbproject')
          .getPublicUrl(`/${filename}`)

        if (!urlData || !urlData.publicUrl) {
          throw new Error("Failed to get public URL")
        }

        console.log("Public URL:", urlData.publicUrl)

        // Add the public URL to the form data
        const bookData = {
          ...formData,
          bookImage: urlData.publicUrl,
        }

        // Send the data to the backend API
        const response = await axios.post("http://localhost:3000/api/books/addbook", bookData)

        // Log the response
        console.log("API Response:", response.data)

        toast.success("Book Added", {
          description: `"${formData.title}" has been added to the library.`,
        })

        // Reset form
        setFormData(initialFormData)
        setFile(null)
      } catch (error) {
        console.error("Error uploading file or submitting data:", error)

        toast.error("Failed to add book", {
          description: "Please try again. Check console for details.",
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileDrop,
    accept: 'image/*' as any,
    maxFiles: 1,
  })

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Add New Book</h1>
          <p className="text-slate-400 text-sm">Fill in the details to add a new book to your library</p>
        </div>
        <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800 hover:text-amber-400">
          <BookOpen className="mr-2 h-4 w-4" /> View All Books
        </Button>
      </div>

      <Card className="bg-slate-900/50 border-slate-800/70 text-white shadow-xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-amber-400">Book Information</CardTitle>
          <CardDescription className="text-slate-400">
            Enter the details of the book you want to add to the library.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Book title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="bg-slate-800/50 border-slate-700 text-white focus-visible:ring-amber-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author" className="text-slate-300">Author *</Label>
                <Input
                  id="author"
                  name="author"
                  placeholder="Author name"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  className="bg-slate-800/50 border-slate-700 text-white focus-visible:ring-amber-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre" className="text-slate-300">Genre *</Label>
                <Select value={formData.genre} onValueChange={handleGenreChange} required>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white focus-visible:ring-amber-500">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre} className="hover:bg-slate-700 focus:bg-slate-700 text-slate-200">
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-slate-300">Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  placeholder="Number of copies"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="bg-slate-800/50 border-slate-700 text-white focus-visible:ring-amber-500"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bookImage" className="text-slate-300">Book Cover Image *</Label>
                <div 
                  {...getRootProps()} 
                  className={`border-dashed border-2 ${isDragActive ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700'} 
                    rounded-lg p-6 cursor-pointer transition-all hover:border-amber-500/70 hover:bg-amber-500/5`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center">
                      <Upload className="h-5 w-5 text-amber-400" />
                    </div>
                    <p className="text-slate-300">Drag & drop an image or click to select</p>
                    <p className="text-xs text-slate-500">Supports JPG, PNG, WebP up to 5MB</p>
                    {file && (
                      <div className="mt-2 flex items-center gap-2 text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full">
                        <Check className="h-4 w-4" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bookDetails" className="text-slate-300">Short Description *</Label>
                <Textarea
                  id="bookDetails"
                  name="bookDetails"
                  placeholder="Brief description of the book"
                  value={formData.bookDetails}
                  onChange={handleChange}
                  required
                  className="bg-slate-800/50 border-slate-700 text-white resize-none h-20 focus-visible:ring-amber-500"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bookSummary" className="text-slate-300">Full Summary *</Label>
                <Textarea
                  id="bookSummary"
                  name="bookSummary"
                  placeholder="Detailed summary of the book's content"
                  value={formData.bookSummary}
                  onChange={handleChange}
                  required
                  className="bg-slate-800/50 border-slate-700 text-white resize-none h-32 focus-visible:ring-amber-500"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-slate-800/70 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData(initialFormData)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-medium"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-0 border-r-0 border-slate-950 rounded-full"></div>
                  Adding...
                </div>
              ) : (
                <div className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" /> Add Book
                </div>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  )
}
