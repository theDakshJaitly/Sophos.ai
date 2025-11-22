"use client"

import { Button } from "@/components/ui/button"
import { UploadedFile } from "../page";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase-client'; // Make sure Supabase is imported

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

    setIsLoading(true);
    setWorkflowData(null);
    try {
      // 1. Get the current user session from Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error("Your session could not be verified. Please log in again.");
      }
      const formData = new FormData();
      formData.append('file', file);

      // Debug: Log token and headers
      console.log('Supabase session:', session);
      console.log('Access token:', session.access_token);
      const headers = {
        'Authorization': `Bearer ${session.access_token}`
      };
      console.log('Upload request headers:', headers);

      // 2. Make the authenticated API call with the correctly formatted headers
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/documents/upload`,
        formData,
        { headers }
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
      // 3. Show a clear error to the user if anything fails
      const errMessage = (axios.isAxiosError(error) && error.response?.data?.message)
        ? error.response.data.message
        : error instanceof Error ? error.message : "An unknown error occurred.";

      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: errMessage,
      });
      console.error("Upload failed:", error);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col p-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary" />
        <h1 className="text-2xl font-bold">Sophos.ai</h1>

      </div>

      <div className="flex-grow">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Recent Uploads</h3>
        <ul className="space-y-1">
          {recentUploads.length > 0 ? (
            recentUploads.map((file) => (
              <li key={file.id}>
                <Button variant="ghost" className="w-full justify-start text-sm truncate font-normal">
                  {file.name}
                </Button>
              </li>
            ))
          ) : (
            <p className="text-xs text-muted-foreground px-2">Upload a document to start.</p>
          )}
        </ul>
      </div>

      <div className="mt-auto space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Current Session</h3>
          {recentUploads.length > 0 ? (
            <Button variant="secondary" className="w-full justify-start text-sm truncate">
              {recentUploads[0].name}
            </Button>
          ) : (
            <p className="text-xs text-muted-foreground px-2">No document loaded.</p>
          )}
        </div>

        <label htmlFor="file-upload" className="w-full">
          <Button asChild className="w-full cursor-pointer" disabled={isLoading}>
            <span>
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>
              ) : (
                "Upload New Document"
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
  );
}