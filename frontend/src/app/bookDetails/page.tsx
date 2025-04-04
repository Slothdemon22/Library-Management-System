import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpenIcon, LogOutIcon } from "lucide-react"
import BookCard from "@/components/ui/book-cards"

export default function Home() {
  const popularBooks = [
    {
      id: 1,
      title: "Origin",
      author: "Dan Brown",
      genre: "Thriller / Mystery",
      image: "/images/origin.png",
      description:
        "Origin is a 2017 mystery-thriller novel by American author Dan Brown. It is the fifth installment in the Robert Langdon series.",
      tags: [
        { emoji: "🔍", label: "Mystery" },
        { emoji: "⚡", label: "Suspense" },
        { emoji: "🏛️", label: "Art & History" },
      ],
    },
    {
      id: 2,
      title: "The Fury",
      author: "Alex Michaelides",
      genre: "Psychological Thriller",
      image: "/images/the-fury.png",
      tags: [
        { emoji: "🧠", label: "Mind games" },
        { emoji: "😱", label: "Suspense" },
        { emoji: "🌊", label: "Island setting" },
      ],
    },
    {
      id: 3,
      title: "The Maidens",
      author: "Alex Michaelides",
      genre: "Psychological Thriller",
      image: "/images/the-maidens.jpg",
      tags: [
        { emoji: "🧠", label: "Psychological" },
        { emoji: "🏛️", label: "Academic" },
      ],
    },
    {
      id: 4,
      title: "Gerald's Game",
      author: "Stephen King",
      genre: "Horror / Thriller",
      image: "/images/geralds-game.jpg",
      tags: [
        { emoji: "👻", label: "Scary" },
        { emoji: "🔗", label: "Trapped" },
        { emoji: "💀", label: "Survival" },
      ],
    },
    {
      id: 5,
      title: "Don't Turn Around",
      author: "Jessica Barry",
      genre: "Thriller / Suspense",
      image: "/images/dont-turn-around.jpg",
      tags: [
        { emoji: "🚗", label: "Road trip" },
        { emoji: "⚡", label: "Suspense" },
      ],
    },
    {
      id: 6,
      title: "The Huge Book of Amazing Facts",
      author: "Jenny Taylor",
      genre: "Non-fiction / Reference",
      image: "/images/amazing-facts.png",
      tags: [
        { emoji: "📊", label: "Facts" },
        { emoji: "🧪", label: "Science" },
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <BookOpenIcon className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold">BookWise</h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <a href="#" className="hover:text-gray-300 transition-colors">
                Home
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Search
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-sm font-medium">AD</span>
                </div>
                <span>Adrian</span>
              </div>
              <LogOutIcon className="h-5 w-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>
        </header>

        {/* Book Details Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="space-y-6">
            <h2 className="text-5xl font-bold">Origin</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-300">By Dan Brown</span>
                <span className="mx-2">•</span>
                <span className="text-gray-300">Category:</span>
                <Badge variant="outline" className="text-blue-400 border-blue-700">
                  Thriller / Suspense
                </Badge>
              </div>
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(4)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
                <span className="ml-2 text-blue-400">4.5/5</span>
              </div>
            </div>
            <div className="space-y-1">
              <p>
                <span className="text-gray-400">Total books:</span> <span className="font-medium">100</span>
              </p>
              <p>
                <span className="text-gray-400">Available books:</span> <span className="font-medium">42</span>
              </p>
            </div>
            <p className="text-gray-300">
              Origin is a 2017 mystery-thriller novel by American author Dan Brown. It is the fifth installment in the
              Robert Langdon series, following previous bestsellers such as The Da Vinci Code and Angels & Demons.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-6">
              <BookOpenIcon className="h-4 w-4" />
              <span>BORROW BOOK REQUEST</span>
            </Button>
          </div>
          <div className="relative flex justify-center">
            <div className="absolute bottom-0 w-[80%] h-[90%] transform rotate-6 blur-sm opacity-40 bg-gradient-to-t from-transparent to-gray-700 rounded-lg"></div>
            <div className="relative transform -rotate-6 transition-transform hover:rotate-0 duration-300">
              <Image
                src="/images/origin.png"
                alt="Origin by Dan Brown"
                width={300}
                height={450}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* Popular Books Section */}
        <section>
          <h3 className="text-2xl font-bold mb-6">Popular Books</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

