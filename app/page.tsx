'use client';

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, FileText, PenTool, Search, Share2, Users2, Store, Mail, Linkedin, Twitter, Facebook, Instagram } from "lucide-react"
import { WaveBackground } from "@/components/ui/wave-background"
import { Analytics } from "@vercel/analytics/next"

export default function Home() {
  const [showPricingTooltip, setShowPricingTooltip] = useState(false);

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPricingTooltip(true);
    setTimeout(() => setShowPricingTooltip(false), 5000);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="w-full border-b bg-white sticky top-0 z-50">
        <div className="px-4 lg:px-6 h-16 flex items-center justify-between max-w-7xl mx-auto w-full">
          {/* Logo - Far Left */}
          <div>
            <h1 className="text-3xl font-bold text-black">Sophos.ai</h1>
          </div>

          {/* Navigation Links - Right */}
          <nav className="flex gap-6 items-center relative">
            <button
              onClick={() => scrollToSection('about')}
              className="text-base font-medium hover:text-primary transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-base font-medium hover:text-primary transition-colors cursor-pointer"
            >
              Features
            </button>
            <div className="relative">
              <button
                onClick={handlePricingClick}
                className="text-base font-medium hover:text-primary transition-colors cursor-pointer"
              >
                Pricing
              </button>
              {showPricingTooltip && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 bg-white border-2 border-blue-500 text-black text-sm rounded-lg shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-top-2 z-50">
                  It's free for now Fellas! 🎉
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-[-2px]">
                    <div className="border-[6px] border-transparent border-b-blue-500"></div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-base font-medium hover:text-primary transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative">
          <WaveBackground />
          <div className="container px-4 md:px-6 max-w-7xl mx-auto relative">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Revolutionize Your Document Workflow
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Upload PDFs, PPTs, and more. We'll organize, summarize, and enhance your documents with AI-powered
                  research.
                </p>
              </div>
              <div className="flex justify-center">
                <Button asChild size="lg">
                  <Link href="/login">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section - NEW */}
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              Transforming static pages into living knowledge.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe that reading shouldn't be a passive activity. Sophos.ai was built to bridge the gap between raw documents and deep understanding. By combining advanced extraction with semantic mapping, we turn your PDFs into interactive study partners, not just digital paper.
            </p>
          </div>
        </section>

        {/* Key Features */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <FileText className="w-8 h-8 mb-2" />
                  <CardTitle>Smart Document Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  Upload PDFs, PPTs, and other document types. Our AI will automatically organize and categorize your
                  files.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <PenTool className="w-8 h-8 mb-2" />
                  <CardTitle>AI-Powered Summarization</CardTitle>
                </CardHeader>
                <CardContent>
                  Get concise summaries of your documents, highlighting key points and insights.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Search className="w-8 h-8 mb-2" />
                  <CardTitle>Web Research Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  Our AI agents search the web to enrich your documents with relevant, up-to-date information.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">How It Works</h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12 items-start">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Upload Your Documents</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Simply drag and drop your PDFs, PPTs, and other files into our secure platform.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">AI Processing</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Our advanced AI analyzes, organizes, and summarizes your documents, while researching related
                  information.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Access Enhanced Content</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  View your organized, summarized, and enriched documents in an intuitive interface.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Future Enhancements */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Future Enhancements</h2>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <Card>
                <CardHeader>
                  <Share2 className="w-8 h-8 mb-2" />
                  <CardTitle>Multi-Agent Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    In the future, we plan to introduce multiple AI agents, each with unique specializations, working
                    together to provide even more comprehensive document analysis and enhancement.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <ChevronRight className="w-8 h-8 mb-2" />
                  <CardTitle>Customizable Workflows</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    We're developing features that will allow you to create custom document processing workflows,
                    tailored to your specific needs and industry requirements.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users2 className="w-8 h-8 mb-2" />
                  <CardTitle>Social Study Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Connect with friends, classmates, and colleagues to collaborate on document analysis and research.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Store className="w-8 h-8 mb-2" />
                  <CardTitle>Workflow Marketplace</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Workflows designed by experts in various fields will be available for purchase and integration into your document processing pipeline. Or sell your own workflows to other users!
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Get In Touch / Contact Section - NEW */}
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Get In Touch
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Have questions? We'd love to hear from you. Connect with us on social media or send us an email.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
              {/* Email Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-600 mb-1">Email</p>
                      <a
                        href="mailto:contact@sophos.ai"
                        className="text-base font-medium hover:text-primary transition-colors"
                      >
                        contact@sophos.ai
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Socials Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
                      <Linkedin className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-600 mb-1">LinkedIn</p>
                      <a
                        href="https://linkedin.com/company/sophos-ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-medium hover:text-primary transition-colors"
                      >
                        /company/sophos-ai
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 transition-colors">
                        <Facebook className="h-5 w-5 text-white" />
                      </button>
                      <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 transition-colors">
                        <Instagram className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-900 text-white py-8">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">Sophos.ai</h3>
            </div>
            <p className="text-sm text-gray-400">
              © 2025 Sophos.ai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <Analytics />
    </div>
  )
}
