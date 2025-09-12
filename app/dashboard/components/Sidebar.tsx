'use client';

import { useEffect, useMemo, useState } from "react";
import api from '@/utils/api';
import { Button } from "@/components/ui/button";
import { Folder, Settings, User, Plus, FolderTree, CornerDownRight } from "lucide-react";
import { Comfortaa } from "next/font/google";
import { projectApi } from "@/utils/api";

interface SidebarProps {
  setWorkflowData: (data: { nodes: any[]; edges: any[] } | null) => void;
}

export function Sidebar({ setWorkflowData }: SidebarProps) {
  return (
    <div className="w-64 bg-white p-4 flex flex-col h-full">
      <h2 className={`text-3xl font-bold mb-4 ${comfortaa.className}`}>Sophos.ai</h2>
      <div className="flex items-center gap-2 mb-6 text-gray-700">
        <FolderTree className="h-6 w-6" />
        <span className="text-lg font-semibold">Projects</span>
      </div>
      <div className="flex-grow overflow-auto">
        <ProjectList />
      </div>
      <div className="mt-auto pt-4 border-t space-y-2">
        <UploadButton setWorkflowData={setWorkflowData} />
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
        <div className="flex justify-between">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function UploadButton({ setWorkflowData }: { setWorkflowData: SidebarProps["setWorkflowData"] }) {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setWorkflowData(null);
      const response = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setWorkflowData(response.data.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <label htmlFor="file-upload" className="w-full">
        <Button asChild className="w-full cursor-pointer">
          <span>Upload Document</span>
        </Button>
      </label>
      <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf" />
    </div>
  );
}

function ProjectList() {
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
}

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["700"],
});

