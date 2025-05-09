"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ShieldAlert } from "lucide-react"

interface MakeAdminDialogProps {
  userName: string
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export const MakeAdminDialog = ({ userName, onSuccess, trigger }: MakeAdminDialogProps) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useUser()

  const handleMakeAdmin = async () => {
    setLoading(true)
    const clerkID = user?.id
    const data = { isadmin: "true", clerkID }
    console.log("Sending to /api/admin/makeAdmin with clerkID:", clerkID)
    try {
      const res = await fetch("http://localhost:3000/api/admin/makeAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to make admin")
      toast.success(`${userName} is now an admin!`)
      setOpen(false)
      onSuccess?.()
    } catch (err) {
      toast.error("Failed to make admin")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="text-amber-500 border-amber-500 hover:bg-amber-500/10">
            Make Admin
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-400">
            <ShieldAlert className="h-5 w-5" />
            Confirm Make Admin
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 text-slate-300">
          Are you sure you want to make <span className="font-semibold text-white">{userName}</span> an admin?
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)} className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
            Cancel
          </Button>
          <Button
            onClick={handleMakeAdmin}
            disabled={loading}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
          >
            {loading ? "Processing..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 