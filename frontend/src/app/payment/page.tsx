"use client"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Activity, ArrowRight, CreditCard, DollarSign, Lock, Shield, CheckCircle2, BookOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const stripePromise = loadStripe("pk_test_51PrFee05Xih061cSZB11wBkHrgCxoAIbsx1hB40L0hMGd3zAFpcYIAmEi82ATmqIkXCpEOzOp7mrgZLno5Q5tccU00dhIu9Y5p")

const PaymentPage = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<any>(null)
  const [clientSecret, setClientSecret] = useState(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const stripe = useStripe()
  const elements = useElements()

  const handleCreatePaymentIntent = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:3000/api/books/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: 1000 }),
      })

      if (!response.ok) throw new Error("Failed to create checkout session")

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (!stripe) throw new Error("Stripe.js has not loaded yet")

      const { error } = await stripe.redirectToCheckout({ sessionId })
      if (error) setError(error.message)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (!stripe || !elements || !clientSecret) return
    setIsProcessing(true)
    const cardElement = elements.getElement(CardElement)
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement as any },
    })
    if (error) setError(error.message)
    else if (paymentIntent?.status === "succeeded") setPaymentSuccess(true)
    setIsProcessing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50">
      <main className="container mx-auto px-4 py-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left */}
          <div className="flex-1">
            <Card className="bg-slate-900/50 border-slate-800/70 text-white shadow-xl backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="h-6 w-6 text-amber-500" />
                  <CardTitle className="text-2xl">Library Membership Payment</CardTitle>
                </div>
                <CardDescription className="text-slate-300">
                  Complete your payment to access premium library features
                </CardDescription>
              </CardHeader>

              <CardContent>
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <p>{error}</p>
                  </div>
                )}

                {paymentSuccess ? (
                  <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-6 rounded-lg text-center space-y-4">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                    <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
                    <p className="text-slate-300">Thank you for your payment. Your library membership has been activated.</p>
                    <Link href="/dashboard">
                      <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950">
                        Go to Dashboard <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-slate-300">Click below to initiate your secure payment session.</p>
                    <Button 
                      onClick={handleCreatePaymentIntent} 
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950"
                    >
                      {isProcessing ? (
                        <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div> 
                        Processing...</>
                      ) : (
                        <>Start Payment <ArrowRight className="h-4 w-4 ml-2" /></>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right */}
          <div className="lg:w-96">
            <Card className="bg-slate-900/50 border-slate-800/70 text-white shadow-xl backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between border-b border-slate-800 pb-3 text-sm text-slate-300">
                    <span>Premium Membership</span>
                    <span>$10.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-3 text-white font-semibold">
                    <span>Total</span>
                    <span className="text-xl">$10.00</span>
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 space-y-2">
                  <h4 className="text-white font-medium mb-1 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-amber-500" /> Premium Features
                  </h4>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" /> Unlimited book borrowing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" /> Priority book reservations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" /> Extended borrowing periods
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" /> 24/7 Support
                    </li>
                  </ul>
                </div>
                <div className="text-xs text-slate-400 text-center mt-6 flex items-center justify-center gap-2">
                  <Lock className="h-3 w-3" /> Secure payment powered by Stripe
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 gap-4 mt-16">
          {[
            { icon: Shield, title: "Secure Payment", desc: "256-bit SSL encryption" },
            { icon: Lock, title: "Privacy Protected", desc: "No data sharing" }
          ].map((item, i) => (
            <Card key={i} className="bg-slate-900/50 border-slate-800/70 text-center hover:border-amber-500/20 transition-colors">
              <CardContent className="pt-6">
                <item.icon className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                <h3 className="font-medium text-white">{item.title}</h3>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

const App = () => (
  <Elements stripe={stripePromise}>
    <PaymentPage />
  </Elements>
)

export default App
