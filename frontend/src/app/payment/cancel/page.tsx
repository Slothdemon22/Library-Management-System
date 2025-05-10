"use client"

import { XCircle, ArrowRight, BookOpen, Clock, HelpCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"

export default function PaymentCancelPage() {
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
                <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                  <XCircle className="h-10 w-10 text-red-500" />
                </div>
                <CardTitle className="text-3xl">Payment Cancelled</CardTitle>
                <CardDescription className="text-slate-300 mt-2 text-lg">
                  Your payment was cancelled. You can try again when you're ready.
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
                      <span className="text-red-500 font-medium">Cancelled</span>
                    </div>
                  </div>
                </div>

                {/* Help Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Need Help?</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <HelpCircle className="h-5 w-5 text-amber-500 mt-1" />
                        <div>
                          <h4 className="font-medium mb-1">Contact Support</h4>
                          <p className="text-sm text-slate-300">Our team is here to help with any questions</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-amber-500 mt-1" />
                        <div>
                          <h4 className="font-medium mb-1">Try Again Later</h4>
                          <p className="text-sm text-slate-300">Your cart will be saved for 24 hours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/payment" className="w-full sm:w-auto">
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950">
                      Try Again <ArrowRight className="h-4 w-4 ml-2" />
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