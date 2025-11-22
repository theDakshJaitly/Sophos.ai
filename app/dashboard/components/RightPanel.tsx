// In app/dashboard/components/RightPanel.tsx
"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Brain, BookOpen, Wrench, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase-client';
import { User } from '@supabase/supabase-js';

export function RightPanel() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

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

  const handleGenerateFlashcards = () => {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  };

  const handleMakeQuiz = () => {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  };

  return (
    <div className="w-80 bg-white p-4 flex flex-col h-full">
      {/* 👇 NEW: User Profile Section at the top */}
      <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Profile</h3>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Log Out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          {user ? (
            <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                {user.email?.[0].toUpperCase()}
              </div>
              <p className="text-sm font-medium truncate">{user.email}</p>
            </div>
          ) : (
            <div className="h-[52px] bg-gray-100 rounded-lg animate-pulse"></div> // Loading skeleton
          )}
        </div>

      {/* 👇 YOUR EXISTING TOOLS SECTION (UNCHANGED) */}
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

      {/* 👇 YOUR EXISTING FOOTER (UNCHANGED) */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-400 font-medium">
            DJ Productions
          </p>
          <p className="text-xs text-gray-300 mt-1">
            ✨ Powered by AI
          </p>
        </div>
      </div>
    </div>
  );
}
