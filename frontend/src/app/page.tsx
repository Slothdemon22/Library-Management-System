"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight, BookOpen, Check, Library, Shield, Users, BookMarked, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function LandingPage() {
  const [activePlan, setActivePlan] = useState<"monthly" | "yearly">("monthly")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/20">
              Library Management Made Simple
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Manage Your Library With</span>
              <span className="block bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                BookWise
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-300">
              A complete solution for libraries of all sizes. Streamline book management, track borrowing, and engage
              with your readers.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-medium"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Book a Demo
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 rounded-xl bg-slate-900/50 p-4 shadow-2xl ring-1 ring-slate-800/50 sm:p-6 md:p-8">
            <Image
              src="/images/bookwise-dashboard.png"
              alt="BookWise Dashboard"
              width={1200}
              height={600}
              className="rounded-lg border border-slate-800/50 shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/20">
              Features
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything You Need to Run Your Library</h2>
            <p className="mt-4 text-lg text-slate-300">
              BookWise provides all the tools you need to manage your library efficiently and effectively.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={BookOpen}
              title="Book Management"
              description="Easily add, edit, and organize your entire book collection with powerful cataloging tools."
            />
            <FeatureCard
              icon={Users}
              title="User Management"
              description="Keep track of all your library members, their borrowing history, and preferences."
            />
            <FeatureCard
              icon={BookMarked}
              title="Borrowing System"
              description="Streamline the borrowing process with automated due dates, reminders, and return tracking."
            />
            <FeatureCard
              icon={Shield}
              title="Secure Access"
              description="Role-based access control ensures that only authorized personnel can perform sensitive operations."
            />
            <FeatureCard
              icon={Settings}
              title="Customizable"
              description="Tailor BookWise to your library's specific needs with flexible configuration options."
            />
            <FeatureCard
              icon={Library}
              title="Comprehensive Reports"
              description="Generate detailed reports on book circulation, popular genres, and user activity."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/20">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Trusted by Librarians Worldwide</h2>
            <p className="mt-4 text-lg text-slate-300">
              Hear what librarians and administrators have to say about BookWise.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard
              quote="BookWise has completely transformed how we manage our university library. The borrowing system is intuitive and our students love it."
              author="Sarah Johnson"
              role="Head Librarian"
              organization="State University"
            />
            <TestimonialCard
              quote="The reporting features have given us valuable insights into our collection. We've been able to better allocate our budget based on actual usage patterns."
              author="Michael Chen"
              role="Library Director"
              organization="Public Library Network"
            />
            <TestimonialCard
              quote="Implementation was smooth and the support team was there every step of the way. Our staff picked up the system quickly with minimal training."
              author="Emily Rodriguez"
              role="School Librarian"
              organization="Lincoln High School"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/20">
              Pricing
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-slate-300">
              Choose the plan that works best for your library's size and needs.
            </p>

            <div className="mt-8 inline-flex items-center rounded-full bg-slate-800/50 p-1">
              <button
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  activePlan === "monthly"
                    ? "bg-amber-500 text-slate-950"
                    : "bg-transparent text-slate-300 hover:text-white"
                }`}
                onClick={() => setActivePlan("monthly")}
              >
                Monthly
              </button>
              <button
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  activePlan === "yearly"
                    ? "bg-amber-500 text-slate-950"
                    : "bg-transparent text-slate-300 hover:text-white"
                }`}
                onClick={() => setActivePlan("yearly")}
              >
                Yearly <span className="text-xs opacity-75">(Save 20%)</span>
              </button>
            </div>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-6">
            <PricingCard
              title="Basic"
              price={activePlan === "monthly" ? "$29" : "$23"}
              period={activePlan === "monthly" ? "per month" : "per month, billed yearly"}
              description="Perfect for small libraries just getting started."
              features={[
                "Up to 5,000 books",
                "Up to 3 staff accounts",
                "Basic borrowing system",
                "Standard reports",
                "Email support",
              ]}
              buttonText="Get Started"
              buttonVariant="outline"
              href="/payment"
            />
            <PricingCard
              title="Premium"
              price={activePlan === "monthly" ? "$99" : "$79"}
              period={activePlan === "monthly" ? "per month" : "per month, billed yearly"}
              description="Ideal for medium-sized libraries with growing collections."
              features={[
                "Up to 20,000 books",
                "Up to 10 staff accounts",
                "Advanced borrowing system",
                "Custom reports",
                "Priority email support",
                "API access",
              ]}
              buttonText="Get Started"
              buttonVariant="primary"
              popular={true}
              href="/payment"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 p-8 shadow-xl sm:p-12">
            <div className="flex flex-col items-center text-center lg:flex-row lg:text-left">
              <div className="lg:flex-1">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to transform your library?</h2>
                <p className="mt-4 text-lg text-slate-300">
                  Join thousands of libraries that trust BookWise for their management needs.
                </p>
              </div>
              <div className="mt-8 flex flex-shrink-0 flex-col space-y-4 lg:mt-0 lg:ml-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-medium"
                >
                  Get Started Today
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
                >
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                  <Library className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                  BookWise
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-400">
                A complete library management system designed to streamline operations and enhance the user experience.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Product</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-slate-300 hover:text-amber-400">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-amber-400">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-amber-400">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-amber-400">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Company</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-slate-300 hover:text-amber-400">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-amber-400">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-amber-400">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-amber-400">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-slate-300 hover:text-amber-400">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-amber-400">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-amber-400">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-800 pt-8 text-center">
            <p className="text-sm text-slate-400">© {new Date().getFullYear()} BookWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Feature Card Component
function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <Card className="bg-slate-900/50 border-slate-800/70 text-white shadow-xl backdrop-blur-sm hover:bg-slate-900/70 transition-colors">
      <CardHeader>
        <div className="mb-4 h-12 w-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center">
          <Icon className="h-6 w-6 text-amber-400" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-300">{description}</p>
      </CardContent>
    </Card>
  )
}

// Testimonial Card Component
function TestimonialCard({
  quote,
  author,
  role,
  organization,
}: {
  quote: string
  author: string
  role: string
  organization: string
}) {
  return (
    <Card className="bg-slate-900/50 border-slate-800/70 text-white shadow-xl backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="mb-4 text-amber-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="text-lg">
              ★
            </span>
          ))}
        </div>
        <p className="mb-6 text-slate-300 italic">"{quote}"</p>
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold">
            {author.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="font-medium">{author}</p>
            <p className="text-sm text-slate-400">
              {role}, {organization}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Pricing Card Component
function PricingCard({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  buttonVariant,
  popular = false,
  href,
}: {
  title: string
  price: string
  period: string
  description: string
  features: string[]
  buttonText: string
  buttonVariant: "primary" | "outline"
  popular?: boolean
  href: string
}) {
  return (
    <Card
      className={`bg-slate-900/50 border-slate-800/70 text-white shadow-xl backdrop-blur-sm relative ${
        popular ? "border-amber-500/50 ring-1 ring-amber-500/20" : ""
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950">Most Popular</Badge>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-slate-400 ml-2">{period}</span>
        </div>
        <CardDescription className="text-slate-300 mt-4">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-amber-400 mr-2 shrink-0 mt-0.5" />
              <span className="text-slate-300">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Link href={href} className="w-full">
          <Button
            className={
              buttonVariant === "primary"
                ? "w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-medium"
                : "w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            }
            variant={buttonVariant === "primary" ? "default" : "outline"}
          >
            {buttonText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
