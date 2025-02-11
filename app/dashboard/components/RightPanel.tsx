import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Brain } from "lucide-react";
import { useState } from "react";
import { documentApi } from "../../../utils/api"; // Updated import path
import { useToast } from "@/hooks/use-toast";

export function RightPanel() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      // For now, we'll use a default project ID - you'll want to get this from your app's state
      const projectId = "default";
      await documentApi.uploadDocument(projectId, file);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-80 bg-white p-4 flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4">Tools</h2>
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div 
            className="flex items-center justify-center h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileSelect}
            />
            <label htmlFor="file-upload" className="cursor-pointer text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-1 text-sm text-gray-600">
                {uploading ? "Uploading..." : "Drag and drop or click to upload"}
              </p>
            </label>
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
  );
}
