'use client';

import { useEffect, useMemo, useState } from "react";
import axios from 'axios';
import api from '@/utils/api';
import { Button } from "@/components/ui/button";
import { Folder, Settings, User, Plus, FolderTree, CornerDownRight, Loader2 } from "lucide-react";
import { Comfortaa } from "next/font/google";
import { projectApi } from "@/utils/api";
import { UploadedFile } from "../page";
import { useToast } from "@/hooks/use-toast";


interface SidebarProps {
  setWorkflowData: (data: { nodes: any[]; edges: any[] } | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  recentUploads: UploadedFile[]; 
  setRecentUploads: React.Dispatch<React.SetStateAction<UploadedFile[]>>; 
}

export function Sidebar({ setWorkflowData, setIsLoading, setRecentUploads, recentUploads }: SidebarProps) {
  return (
    <div className="w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 p-6 flex flex-col h-full">
      {/* Header with better styling */}
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${comfortaa.className} text-black`}>
          Sophos.ai
        </h2>
        <p className="text-xs text-gray-500">AI-Powered Document Analysis</p>
      </div>

      {/* Projects section with better styling */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4 text-gray-700">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <FolderTree className="h-4 w-4 text-blue-600" />
          </div>
          <span className="text-lg font-semibold">Projects</span>
        </div>
        <div className="flex-grow overflow-auto bg-white rounded-lg border border-gray-100 p-3 min-h-[200px]">
          
        </div>
      </div>

      {/* Action buttons with better styling */}
      <div className="mt-auto space-y-3">
        <UploadButton 
          setWorkflowData={setWorkflowData} 
          setIsLoading={setIsLoading}
          setRecentUploads={setRecentUploads}
          recentUploads={recentUploads}
        />
        <Button variant="outline" className="w-full bg-white hover:bg-gray-50 border-gray-200">
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
        
        {/* User actions with icons */}
        <div className="flex justify-between pt-2">
          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function UploadButton({ setWorkflowData, setIsLoading, setRecentUploads, recentUploads }: { 
  setWorkflowData: SidebarProps["setWorkflowData"];
  setIsLoading: SidebarProps["setIsLoading"];
  setRecentUploads: SidebarProps["setRecentUploads"];
  recentUploads: SidebarProps["recentUploads"];
}) {
  const { toast } = useToast();
  const [isLoading, setIsLoadingState] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoadingState(true);
      setWorkflowData(null);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/documents/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setWorkflowData(response.data.data);
      setRecentUploads(prev => [
        { id: new Date().toISOString(), name: file.name },
        ...prev
      ].slice(0, 5)); // Keep only the latest 5

      toast({
        title: "Success!",
        description: `"${file.name}" uploaded and processed.`,
      });

      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error uploading file:', error.response.data.message);
        // Here you would use a toast notification to show the user
        // alert(error.response.data.message); 
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: error.response.data.message || "An unknown error occurred.",
        });
      } else {
        console.error('An unexpected error occurred:', error);
        // alert('An unexpected error occurred. Please try again.');
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsLoadingState(false);
    }
  };

  return (
    <div>
      <label htmlFor="file-upload" className="w-full">
        <Button asChild className="w-full cursor-pointer" disabled={isLoading}>
          <span>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
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
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Recent Uploads</h3>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {recentUploads.length > 0 ? (
            recentUploads.map((file) => (
              <div key={file.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-xs text-gray-700 truncate flex-1" title={file.name}>
                  {file.name}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-gray-400">No documents uploaded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
    
  );
}

/*function ProjectList() {
  const [projects, setProjects] = useState<Array<{ _id?: string; id?: string; name: string; group: string }>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    projectApi.getProjects()
      .then(({ data }) => { if (mounted) setProjects(data); })
      .catch(() => { if (mounted) setProjects([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, Array<{ _id?: string; id?: string; name: string; group: string }>>();
    for (const p of projects) {
      const arr = map.get(p.group) || [];
      arr.push(p);
      map.set(p.group, arr);
    }
    return Array.from(map.entries());
  }, [projects]);

  if (loading) return <div className="text-sm text-gray-500">Loading projects…</div>;
  if (grouped.length === 0) return <div className="text-sm text-gray-500">No projects yet.</div>;

  return (
    <div className="space-y-4">
      {grouped.map(([group, items]) => (
        <div key={group}>
          <div className="flex items-center gap-2 mb-2 text-gray-600">
            <Folder className="h-4 w-4" />
            <span className="text-sm font-medium">{group}</span>
          </div>
          <div className="space-y-1 pl-4">
            {items.map((project) => (
              <div key={project._id || project.id} className="flex items-center p-2 hover:bg-gray-100 rounded">
                <CornerDownRight className="mr-2 h-4 w-4" />
                <span>{project.name}</span>
              </div>
            ))}
          </div>
        </div>
        
      ))}
    </div>
    
  );
} */

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["700"],
});

