import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Brain, Wrench, BookOpen } from "lucide-react"; // Add Wrench and BookOpen to imports
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

  const handleGenerateFlashcards = () => {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  };

  const handleMakeQuiz = () => {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  };

  return (
    <div className="w-80 bg-white p-4 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold">Tools</h2>
        <Wrench className="h-6 w-6" />
      </div>
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
      <Button 
        onClick={handleGenerateFlashcards}
        variant="outline"
        className="w-full mb-3 hover:bg-blue-50 hover:border-blue-200"
      >
        <Brain className="mr-2 h-4 w-4" />
        Generate Flashcards
      </Button>
      <Button 
        onClick={handleMakeQuiz}
        variant="outline"
        className="w-full hover:bg-green-50 hover:border-green-200"
      >
        <BookOpen className="mr-2 h-4 w-4" />
        Make Quiz
      </Button>
      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-400 font-medium">
            A Daksh Jaitly Production
          </p>
          <p className="text-xs text-gray-300 mt-1">
            ✨ Powered by AI
          </p>
        </div>
      </div>
    </div>
  );
}
