import { Toaster } from "sonner"
import { ClerkProvider } from "@clerk/nextjs"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50">
        {children}
        <Toaster position="top-right" richColors />
      </div>
    </ClerkProvider>
  )
} 