// In app/dashboard/components/Sidebar.tsx
"use client"

import { Button } from "@/components/ui/button"
import { UploadedFile } from "../page";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';
import { Loader2 } from 'lucide-react';

interface SidebarProps {
  setWorkflowData: (data: any) => void;
  setIsLoading: (isLoading: boolean) => void;
  recentUploads: UploadedFile[];
  setRecentUploads: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  isLoading: boolean;
}

export function Sidebar({ setWorkflowData, setIsLoading, recentUploads, setRecentUploads, isLoading }: SidebarProps) {
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      setWorkflowData(null);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/documents/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setWorkflowData(response.data);

      setRecentUploads(prev => [
        { id: new Date().toISOString(), name: file.name },
        ...prev
      ].slice(0, 5));

      toast({
        title: "Success!",
        description: `"${file.name}" was processed successfully.`,
      });

    } catch (error) {
      const errMessage = (axios.isAxiosError(error) && error.response?.data?.message)
        ? error.response.data.message
        : "An unknown error occurred.";
      
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: errMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col p-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary" />
        <h1 className="text-xl font-bold">Sophos.ai</h1>
      </div>

      <div className="flex-grow">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Recent Uploads</h3>
        <ul className="space-y-1">
          {recentUploads.length > 0 ? (
            recentUploads.map((file) => (
              <li key={file.id}>
                <Button variant="ghost" className="w-full justify-start text-sm truncate">
                  {file.name}
                </Button>
              </li>
            ))
          ) : (
            <p className="text-xs text-muted-foreground px-2">No documents uploaded yet.</p>
          )}
        </ul>
      </div>

      <div className="mt-auto">
        <label htmlFor="file-upload" className="w-full">
          <Button asChild className="w-full cursor-pointer" disabled={isLoading}>
            <span>
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
              ) : (
                "Upload Document"
              )}
            </span>
          </Button>
        </label>
        <input 
          id="file-upload" 
          type="file" 
          className="hidden" 
          onChange={handleFileChange} 
          accept=".pdf" 
          disabled={isLoading}
        />
      </div>
    </aside>
  )
}