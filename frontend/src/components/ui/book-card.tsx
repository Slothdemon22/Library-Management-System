import Image from "next/image"

interface BookCardProps {
  title: string
  author: string
  genre: string
  imageUrl: string
}

export function BookCard({ title, author, genre, imageUrl }: BookCardProps) {
  return (
    <div className="flex flex-col">
      <div className="relative h-64 mb-2 overflow-hidden rounded-md">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <h3 className="font-bold line-clamp-1">
        {title} - By {author}
      </h3>
      <p className="text-sm text-gray-400">{genre}</p>
    </div>
  )
}
