// In app/dashboard/components/RightPanel.tsx
"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, MessageSquare, FileText, CheckSquare, LogOut, Wrench, Network } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase-client';
import { User } from '@supabase/supabase-js';
import { useDashboard } from "../context/DashboardContext";
import { cn } from "@/lib/utils";

export function RightPanel() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const { activeMode, setActiveMode } = useDashboard();

  // This effect fetches the current user's data when the component loads
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  // This function handles the user logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login'); // Redirect to login page after signing out
  };

  // --- YOUR EXISTING FILE UPLOAD LOGIC (UNCHANGED) ---
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
    // This is placeholder logic, as the main upload is in the Sidebar
    toast({ title: "Note", description: "File upload is handled in the sidebar." });
  };
  // ---------------------------------------------------

  return (
    <div className="w-80 bg-white border-l border-gray-200 dark:border-gray-800 flex flex-col h-full p-4">
      {/* User Profile Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Profile</h3>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Log Out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        {user ? (
          <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
              {user.email?.[0].toUpperCase()}
            </div>
            <p className="text-sm font-medium truncate">{user.email}</p>
          </div>
        ) : (
          <div className="h-[52px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
        )}
      </div>

      {/* Tools / Launchpad Section */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-bold">Launchpad</h2>
        <Wrench className="h-6 w-6" />
      </div>

      {/* File Upload Area */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div
            className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
          >
            <input
              type="file"
              id="file-upload-right-panel"
              className="hidden"
              onChange={handleFileSelect}
            />
            <label htmlFor="file-upload-right-panel" className="cursor-pointer text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-1 text-sm text-gray-600">
                {uploading ? "Uploading..." : "Drag and drop or click"}
              </p>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="space-y-2 flex-1">
        <Button
          variant={activeMode === 'workflow' ? "secondary" : "ghost"}
          className={cn("w-full justify-start", activeMode === 'workflow' && "bg-gray-100 dark:bg-gray-800")}
          onClick={() => setActiveMode('workflow')}
        >
          <Network className="mr-2 h-4 w-4" />
          Workflow
        </Button>
        <Button
          variant={activeMode === 'chat' ? "secondary" : "ghost"}
          className={cn("w-full justify-start", activeMode === 'chat' && "bg-gray-100 dark:bg-gray-800")}
          onClick={() => setActiveMode('chat')}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Chat
        </Button>
        <Button
          variant={activeMode === 'notes' ? "secondary" : "ghost"}
          className={cn("w-full justify-start", activeMode === 'notes' && "bg-gray-100 dark:bg-gray-800")}
          onClick={() => setActiveMode('notes')}
        >
          <FileText className="mr-2 h-4 w-4" />
          Notes
        </Button>
        <Button
          variant={activeMode === 'quiz' ? "secondary" : "ghost"}
          className={cn("w-full justify-start", activeMode === 'quiz' && "bg-gray-100 dark:bg-gray-800")}
          onClick={() => setActiveMode('quiz')}
        >
          <CheckSquare className="mr-2 h-4 w-4" />
          Quiz
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center">
          <p className="text-xs text-gray-400 font-medium">
            A Prometheus Rising Product
          </p>
          <p className="text-xs text-gray-300 mt-1">
            ✨ Powered by AI
          </p>
        </div>
      </div>
    </div>
  );
}
