'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRegister } from "@/hooks/registerHook"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React, { FormEvent, useState } from "react"
import {userSignUpSchema} from '@/types/userTypes'
import { toast } from "sonner"


export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, onSubmitAuth } = useRegister();

  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#1a1f35] to-[#111827] px-4 py-8 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6 bg-[#0f1219] rounded-2xl p-6 md:p-8 shadow-xl">
          {/* Logo */}
          <div className="flex items-center gap-3 text-white mb-6 sm:mb-8">
            <Image src="/loginPageLogo.png" alt="BookWise Logo" width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="text-xl sm:text-2xl font-semibold tracking-tight">BookWise</span>
          </div>

          {/* Header */}
          <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">Create Your Library Account</h1>
            <p className="text-sm text-gray-400 leading-relaxed">Please complete all fields to gain access to the library.</p>
          </div>

          {/* Form */}
          <form
            onSubmit={async (e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
            
              const form = new FormData(e.currentTarget);
            
              const Data=
              {
                name:form.get("name") as string,
                email:form.get("email") as string,
                password:form.get("password") as string
              }
              const parsedData=userSignUpSchema.safeParse(Data);
              if(!parsedData.success)
              {
                toast.error("Data Form not valid");
                return;
              }



              
              await onSubmitAuth(Data.name, Data.email, Data.password);
              if(error)
              {
                toast.error("Form Not Submitted Successfully");
                return ;
              }
              toast.success("Form Successfully Submitted");

            }}
            className="space-y-5 sm:space-y-6"
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-300">Display Name</Label>
                <Input id="name" name="name" placeholder="Enter your full name" className="bg-[#1a1f35]/50 border-gray-800/60 text-white h-10 sm:h-12 placeholder:text-gray-500" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-300">Email</Label>
                <Input id="email" type="email" name="email" placeholder="Enter your email" className="bg-[#1a1f35]/50 border-gray-800/60 text-white h-10 sm:h-12 placeholder:text-gray-500" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-300">Password</Label>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="At least 8 characters long" className="bg-[#1a1f35]/50 border-gray-800/60 text-white h-10 sm:h-12 placeholder:text-gray-500" />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors" onClick={togglePasswordVisibility}>
                    {showPassword ? <Eye className="w-4 h-4 sm:w-5 sm:h-5" /> : <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-[#E6D5B8] hover:bg-[#E6D5B8]/90 text-black font-medium h-10 sm:h-12 text-sm sm:text-base">
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm pt-2">
            Have an account already? <Link href="/" className="text-[#FFD700] hover:underline font-semibold">Login here</Link>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image src="/loginPageImage.png" alt="Collection of books" fill className="object-cover" priority />
      </div>
    </div>
  );
}
