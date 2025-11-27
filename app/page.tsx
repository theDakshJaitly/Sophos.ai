'use client';

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, FileText, PenTool, Search, Share2, Users2, Store, Mail, Linkedin, Twitter, Facebook, Instagram } from "lucide-react"
import { WaveBackground } from "@/components/ui/wave-background"
import { Analytics } from "@vercel/analytics/next"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
              onClick={() => scrollToSection('faq')}
              className="text-base font-medium hover:text-primary transition-colors cursor-pointer"
            >
              FAQ
            </button>
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

        {/* FAQ Section */}
        <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Find answers to common questions about Sophos.ai
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  What is Sophos.ai and how does it work?
                </AccordionTrigger>
                <AccordionContent>
                  Sophos.ai is an AI-powered document processing platform that transforms static documents into interactive, living knowledge. Simply upload your PDFs, PowerPoint presentations, or paste YouTube video links, and our advanced AI will automatically extract key concepts, create visual concept maps, generate comprehensive notes, and build interactive timelines. You can then chat with your documents, take AI-generated quizzes, and enhance your learning experience with intelligent research capabilities.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  What types of files can I upload to Sophos.ai?
                </AccordionTrigger>
                <AccordionContent>
                  Currently, Sophos.ai supports PDF documents and PowerPoint presentations (PPT, PPTX). We also support YouTube video processing by simply pasting the video URL. Our AI extracts text content from these formats, analyzes the information, and creates interactive learning materials. We're constantly working to expand our supported file types to include more document formats in the future.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  How much does Sophos.ai cost?
                </AccordionTrigger>
                <AccordionContent>
                  Sophos.ai is currently free to use! We're in our early access phase and want as many students, researchers, and professionals as possible to experience the power of AI-enhanced document processing. Simply sign up with your email or Google account to get started. We'll announce any pricing plans well in advance as we continue to develop new features.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  Is my data secure on Sophos.ai?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, security is our top priority. We use industry-standard authentication through Supabase, and all file uploads are processed securely. Your documents are stored in a secure database, and we never share your content with third parties. Each user's data is isolated and only accessible through their authenticated account. We follow best practices for data encryption both in transit and at rest.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">
                  Can I use Sophos.ai for studying and note-taking?
                </AccordionTrigger>
                <AccordionContent>
                  Absolutely! Sophos.ai is perfect for students and anyone who wants to improve their learning. Our platform automatically generates organized notes from your documents, creates concept maps to visualize relationships between ideas, and generates quizzes to test your understanding. You can also chat with your documents to ask questions and get instant answers. Many users find it invaluable for studying textbooks, research papers, lecture slides, and educational YouTube videos.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left">
                  How do I get started with Sophos.ai?
                </AccordionTrigger>
                <AccordionContent>
                  Getting started is easy! Click the "Get Started" button to create a free account using your email or Google account. Once logged in, you'll see the dashboard where you can upload your first document or paste a YouTube link. If you don't have a document ready, try our sample document to explore all the features. The AI will process your content and display visual concept maps, timelines, and generate notes. You can then switch between different views using the tabs on the right panel to access chat, notes, and quiz features.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Get In Touch / Contact Section */}
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
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
                        href="mailto:thedakshjaitly@gmail.com"
                        className="text-base font-medium hover:text-primary transition-colors"
                      >
                        thedakshjaitly@gmail.com
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
