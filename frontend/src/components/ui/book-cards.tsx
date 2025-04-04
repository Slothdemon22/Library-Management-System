import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HeartIcon } from "lucide-react"

interface BookCardProps {
  book: {
    id: number
    title: string
    author: string
    genre: string
    image: string
    description?: string
    tags?: Array<{ emoji: string; label: string }>
  }
}

export default function BookCard({ book }: BookCardProps) {
  // Default tags based on genre if not provided, limited to 2-3 tags
  const tags = book.tags ? book.tags.slice(0, 3) : getDefaultTags(book.genre).slice(0, 3)

  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full bg-gray-900">
        {/* Image component with proper width and height */}
        <Image
          src={book.image || "/placeholder.svg"}  // Use valid image path or placeholder
          alt={`${book.title} by ${book.author}`}
          height={200}  // Proper height for the book image
          width={150}   // Proper width for the book image
          className="object-contain p-2"
          layout="intrinsic"  // Ensures correct scaling while maintaining aspect ratio
        />
      </div>

      <CardHeader className="p-3 pb-0 border-b border-gray-700">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm text-white truncate">{book.title}</h4>
        </div>
        <p className="text-gray-300 text-xs">By {book.author}</p>
        <p className="text-gray-400 text-xs mt-2 line-clamp-2">
          {book.description ||
            `A captivating ${book.genre.toLowerCase()} that will keep you engaged from start to finish.`}
        </p>
      </CardHeader>

      <CardContent className="p-3 border-b border-gray-700 flex-grow">
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag.label}
              className="text-xs inline-flex items-center px-2 py-1 rounded-md bg-blue-900/50 text-blue-300"
            >
              <span className="mr-1 text-xl">{tag.emoji}</span> {/* Increased emoji size */}
              {tag.label}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-3 flex gap-2">
        <Button variant="default" size="sm" className="flex-grow bg-blue-600 hover:bg-blue-700 text-white">
          Show details
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 border-gray-600 bg-gray-800 hover:bg-gray-700">
          <HeartIcon className="h-4 w-4 text-red-500" />
        </Button>
      </CardFooter>
    </Card>
  )
}

// Helper function to generate default tags based on genre
function getDefaultTags(genre: string): Array<{ emoji: string; label: string }> {
  const genreMap: Record<string, Array<{ emoji: string; label: string }>> = {
    Thriller: [
      { emoji: "🔍", label: "Mystery" },
      { emoji: "⚡", label: "Suspense" },
      { emoji: "🧩", label: "Plot twists" },
    ],
    Psychological: [
      { emoji: "🧠", label: "Mind games" },
      { emoji: "😱", label: "Suspense" },
      { emoji: "🔮", label: "Twists" },
    ],
    Horror: [
      { emoji: "👻", label: "Scary" },
      { emoji: "🌙", label: "Night terrors" },
      { emoji: "💀", label: "Chilling" },
    ],
    "Non-fiction": [
      { emoji: "📊", label: "Facts" },
      { emoji: "🧪", label: "Science" },
      { emoji: "💡", label: "Knowledge" },
    ],
  }

  // Extract the main genre category
  const mainGenre = Object.keys(genreMap).find((key) => genre.includes(key)) || "Thriller"

  return genreMap[mainGenre]
}
