import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, Brain } from "lucide-react"

export function RightPanel() {
  return (
    <div className="w-80 bg-white p-4 flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4">Tools</h2>
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-1 text-sm text-gray-600">Drag and drop or click to upload</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Button className="mb-2 justify-start" variant="outline">
        <FileText className="mr-2 h-4 w-4" /> Generate Flashcards
      </Button>
      <Button className="mb-4 justify-start" variant="outline">
        <Brain className="mr-2 h-4 w-4" /> Create Quiz
      </Button>
      <div className="mt-auto">
        <h3 className="font-semibold mb-2">Recent Uploads</h3>
        <ul className="space-y-2">
          <li className="text-sm text-gray-600">document1.pdf</li>
          <li className="text-sm text-gray-600">presentation.pptx</li>
          <li className="text-sm text-gray-600">notes.docx</li>
        </ul>
      </div>
    </div>
  )
}

