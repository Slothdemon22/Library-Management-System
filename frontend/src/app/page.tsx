"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Section - Full width on mobile, half on desktop */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#1a1f35] to-[#111827] px-4 py-8 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6 bg-[#0f1219] rounded-2xl p-6 md:p-8 shadow-xl">
          {/* Logo */}
          <div className="flex items-center gap-3 text-white mb-6 sm:mb-8">
            <Image
              src="/loginPageLogo.png"
              alt="BookWise Logo"
              width={32}
              height={32}
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            <span className="text-xl sm:text-2xl font-semibold tracking-tight">BookWise</span>
          </div>

          {/* Header */}
          <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">Welcome Back to BookWise</h1>
            <p className="text-sm text-gray-400 leading-relaxed">
              Access the vast collection of resources, and stay updated
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  defaultValue="adrian@jsmastery.pro"
                  className="bg-[#1a1f35]/50 border-gray-800/60 text-white h-10 sm:h-12 placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "password" : "text"}
                    placeholder="At least 8 characters long"
                    className="bg-[#1a1f35]/50 border-gray-800/60 text-white h-10 sm:h-12 placeholder:text-gray-500 [&::-ms-reveal]:hidden"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={togglePasswordVisibility}>
                    {showPassword ? (
                      <EyeOff className="text-gray-500 hover:text-gray-300 transition-colors w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="text-gray-500 hover:text-gray-300 transition-colors w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button className="w-full bg-[#E6D5B8] hover:bg-[#E6D5B8]/90 text-black font-medium h-10 sm:h-12 text-sm sm:text-base">
              Login
            </Button>

            <p className="text-center text-gray-400 text-sm pt-2">
              Don't have an account already?{" "}
              <Link href="/signup" className="text-[#FFD700] hover:underline font-semibold">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Section - Hidden on mobile, shown on desktop */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/loginPageImage.png"
          alt="Collection of books with various covers and designs"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}

