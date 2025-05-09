import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { ClerkProvider } from "@clerk/nextjs"
import { TopNavbar } from "@/components/top-navbar"
import { Footer } from "@/components/footer"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Library Management System",
  description: "A modern library management system that helps you efficiently manage your book collection, track inventory, and streamline library operations. Features include book management, inventory tracking, and an intuitive dashboard for librarians.",
  keywords: "library management, book tracking, inventory management, library system, digital library",
  authors: [{ name: "Library Management System" }],
  openGraph: {
    title: "Library Management System",
    description: "A modern library management system that helps you efficiently manage your book collection, track inventory, and streamline library operations.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-white antialiased`}>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#fff",
              border: "1px solid #334155",
            },
          }}
        />
        <TopNavbar />
        {children}
        <Footer />
      </body>
    </html>
    </ClerkProvider>
  )
}
