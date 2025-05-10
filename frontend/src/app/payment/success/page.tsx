"use client"

import { CheckCircle2, ArrowRight, BookOpen, Clock, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')
  const period = searchParams.get('period')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50">
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-slate-900/50 border-slate-800/70 text-white shadow-xl backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <CardTitle className="text-3xl">Payment Successful!</CardTitle>
                <CardDescription className="text-slate-300 mt-2 text-lg">
                  Thank you for your payment. Your library membership has been activated.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Order Details */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Order Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-slate-300">
                      <span>Plan</span>
                      <span className="text-white font-medium">{plan || 'Premium Plan'}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Billing Period</span>
                      <span className="text-white font-medium capitalize">{period || 'Monthly'}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Status</span>
                      <span className="text-green-500 font-medium">Active</span>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Next Steps</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <BookOpen className="h-5 w-5 text-amber-500 mt-1" />
                        <div>
                          <h4 className="font-medium mb-1">Access Your Library</h4>
                          <p className="text-sm text-slate-300">Start managing your library with all premium features</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-amber-500 mt-1" />
                        <div>
                          <h4 className="font-medium mb-1">Check Your Email</h4>
                          <p className="text-sm text-slate-300">We've sent you a confirmation email with details</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950">
                      Go to Dashboard <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                      Return Home
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 