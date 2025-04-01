"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { FormEventHandler, useState } from "react"
import {useAuth} from "@/hooks/loginHook"
import {signInWithGoogle} from "@/firebase-config"


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  
  const {loading,error,onSubmitAuth}=useAuth();
  const handleGoogleSignIn=async ()=>
  {
    const res=await signInWithGoogle();
    console.log("Signined in With Google : ",res);
    await fetch("http://localhost:3000/api/auth/OauthLogin", {
      method: 'POST', // Use POST method
      headers: {
        'Content-Type': 'application/json', // Indicate the content type
      },
      body: JSON.stringify({
        
        username: res?.displayName,
        password: res?.email,
      }),
    });
    
  }





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
          <form onSubmit={(e: React.FormEvent<HTMLFormElement>)=> 
            {
              e.preventDefault();
                 const form=new FormData(e.target as HTMLFormElement) ;
                 const email=form.get("email");
                 const password=form.get("password");
                 console.log("email :",email, " Password : ",password);
                 onSubmitAuth(email as String,password as String);

            }
          } className="space-y-5 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
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
                    name="password"
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
            <Button
            type="button"
            variant="outline"
            className="w-full border border-gray-800/60 bg-[#1a1f35]/50 text-white hover:bg-[#1a1f35]/70 h-10 sm:h-12 text-sm sm:text-base flex items-center justify-center gap-2"
            onClick={() => {
              
              console.log("Google sign-in clicked")
              handleGoogleSignIn();
            }}
          >
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="mr-2">
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>
            Sign in with Google
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

