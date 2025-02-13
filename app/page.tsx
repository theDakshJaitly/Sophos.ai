import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, FileText, PenTool, Search, Share2, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full border-b">
        <div className="px-4 lg:px-6 h-14 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2 w-[200px]">
            <Zap className="h-6 w-6" />
            <span className="text-sm font-medium">Daksh Jaitly</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <h1 className="text-xl font-bold">Sophos.ai</h1>
          </div>
          <nav className="flex gap-4 sm:gap-6 w-[200px] justify-end">
            <a className="text-sm font-medium hover:underline underline-offset-4" href="#">Features</a>
            <a className="text-sm font-medium hover:underline underline-offset-4" href="#">Pricing</a>
            <a className="text-sm font-medium hover:underline underline-offset-4" href="#">About</a>
            <a className="text-sm font-medium hover:underline underline-offset-4" href="#">Contact</a>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
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
              <div className="space-x-4">
                <Button asChild>
                  <Link href="/dashboard">Get Started</Link>
                </Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
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
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">A Daksh Jaitly Production</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <a className="text-xs hover:underline underline-offset-4" href="#">
              Terms of Service
            </a>
            <a className="text-xs hover:underline underline-offset-4" href="#">
              Privacy
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}

