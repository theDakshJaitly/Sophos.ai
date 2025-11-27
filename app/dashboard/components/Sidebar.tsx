"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UploadedFile } from "../page";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';
import { Loader2, ChevronLeft, ChevronRight, Upload, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { getApiUrl } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useDashboard } from '../context/DashboardContext';
interface SidebarProps {
    setWorkflowData: (data: any) => void;
    setIsLoading: (isLoading: boolean) => void;
    recentUploads: UploadedFile[];
    setRecentUploads: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
    setCurrentDocumentId: React.Dispatch<React.SetStateAction<string | null>>;
    currentDocumentId?: string | null;
    isLoading: boolean;
}
export function Sidebar({ setWorkflowData, setIsLoading, recentUploads, setRecentUploads, setCurrentDocumentId, currentDocumentId, isLoading }: SidebarProps) {
    const { toast } = useToast();
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [loadingSample, setLoadingSample] = useState(false);
    // Handler to select and load a document from recent uploads
    const handleSelectDocument = async (file: UploadedFile) => {
        if (!file.documentId) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Document ID not found",
            });
            return;
        }
        setIsLoading(true);
        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session) {
                throw new Error("Your session could not be verified. Please log in again.");
            }
            const response = await axios.get(
                getApiUrl(`documents/${file.documentId}`),
                { headers: { 'Authorization': `Bearer ${session.access_token}` } }
            );
            console.log('Document loaded:', response.data);
            // Transform data to match WorkflowData structure
            const transformedData = {
                nodes: response.data.nodes || [],
                edges: response.data.edges || [],
                timeline: response.data.timeline || [],
                actionPlan: response.data.actionPlan || { phases: [] },
                documentId: response.data.documentId
            };
            setWorkflowData(transformedData);
            setCurrentDocumentId(file.documentId);
            toast({
                title: "Document loaded",
                description: `Switched to "${file.name}"`,
            });
        } catch (error) {
            const errMessage = (axios.isAxiosError(error) && error.response?.data?.message)
                ? error.response.data.message
                : error instanceof Error ? error.message : "Failed to load document.";
            toast({
                variant: "destructive",
                title: "Load Failed",
                description: errMessage,
            });
            console.error("Failed to load document:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setIsLoading(true);
        setWorkflowData(null);
        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session) {
                throw new Error("Your session could not be verified. Please log in again.");
            }
            const formData = new FormData();
            formData.append('file', file);
            const headers = {
                'Authorization': `Bearer ${session.access_token}`
            };
            const response = await axios.post(
                getApiUrl('documents/upload'),
                formData,
                { headers }
            );
            console.log('PDF Upload Response:', response.data);
            setWorkflowData(response.data);
            // Extract documentId from response
            const documentId = response.data.documentId;
            setRecentUploads(prev => [
                { id: new Date().toISOString(), name: file.name, documentId },
                ...prev
            ].slice(0, 5));
            // Set this as the current active document
            if (documentId) {
                setCurrentDocumentId(documentId);
            }
            toast({
                title: "Success!",
                description: `"${file.name}" was processed successfully.`,
            });
        } catch (error) {
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
    const handleYoutubeSubmit = async () => {
        if (!youtubeUrl.trim()) {
            toast({
                variant: "destructive",
                title: "Invalid URL",
                description: "Please enter a YouTube URL.",
            });
            return;
        }
        setIsLoading(true);
        setWorkflowData(null);
        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session) {
                throw new Error("Your session could not be verified. Please log in again.");
            }
            const response = await axios.post(
                getApiUrl('youtube/process'),
                { url: youtubeUrl },  // Backend expects 'url', not 'youtubeUrl'
                {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                }
            );
            console.log('YouTube Upload Response:', response.data);
            // Transform the response to match the expected structure
            // Backend returns: { concepts: { nodes, edges }, timeline, actionPlan }
            // Frontend expects: { nodes, edges, timeline, actionPlan }
            const transformedData = {
                nodes: response.data.concepts?.nodes || [],
                edges: response.data.concepts?.edges || [],
                timeline: response.data.timeline || [],
                actionPlan: response.data.actionPlan || { phases: [] },
                documentId: response.data.documentId
            };
            console.log('Transformed data for frontend:', transformedData);
            setWorkflowData(transformedData);
            // Extract documentId from response
            const documentId = response.data.documentId;
            setRecentUploads(prev => [
                { id: new Date().toISOString(), name: `YouTube: ${response.data.videoId}`, documentId },
                ...prev
            ].slice(0, 5));
            // Set this as the current active document
            if (documentId) {
                setCurrentDocumentId(documentId);
            }
            toast({
                title: "Success!",
                description: "YouTube video processed successfully.",
            });
            setYoutubeUrl('');
        } catch (error) {
            const errMessage = (axios.isAxiosError(error) && error.response?.data?.error)
                ? error.response.data.error
                : error instanceof Error ? error.message : "An unknown error occurred.";
            toast({
                variant: "destructive",
                title: "Processing Failed",
                description: errMessage,
            });
            console.error("YouTube processing failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTrySample = async () => {
        setLoadingSample(true);
        setIsLoading(true);
        setWorkflowData(null);

        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session) {
                throw new Error("Your session could not be verified. Please log in again.");
            }

            // Fetch the sample document from public folder
            const response = await fetch('/sample-document.pdf');
            const blob = await response.blob();
            const file = new File([blob], 'Sample-Document.pdf', { type: 'application/pdf' });

            const formData = new FormData();
            formData.append('file', file);

            const headers = {
                'Authorization': `Bearer ${session.access_token}`
            };

            const uploadResponse = await axios.post(
                getApiUrl('documents/upload'),
                formData,
                { headers }
            );

            console.log('Sample Upload Response:', uploadResponse.data);
            setWorkflowData(uploadResponse.data);

            const documentId = uploadResponse.data.documentId;
            setRecentUploads(prev => [
                { id: new Date().toISOString(), name: 'Sample Document', documentId },
                ...prev
            ].slice(0, 5));

            if (documentId) {
                setCurrentDocumentId(documentId);
            }

            toast({
                title: "Sample Loaded!",
                description: "Explore Sophos.ai features with this demo document.",
            });
        } catch (error) {
            const errMessage = (axios.isAxiosError(error) && error.response?.data?.message)
                ? error.response.data.message
                : error instanceof Error ? error.message : "An unknown error occurred.";
            toast({
                variant: "destructive",
                title: "Failed to Load Sample",
                description: errMessage,
            });
            console.error("Sample load failed:", error);
        } finally {
            setIsLoading(false);
            setLoadingSample(false);
        }
    };
    const { leftSidebarCollapsed, toggleLeftSidebar } = useDashboard();

    return (
        <aside
            className={cn(
                "flex-shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col p-4 relative transition-all duration-300 ease-in-out",
                leftSidebarCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className={cn(
                "flex items-center mb-4",
                leftSidebarCollapsed ? "flex-col gap-3" : "gap-3"
            )}>
                <div className="w-10 h-10 rounded-full bg-primary flex-shrink-0" />
                {!leftSidebarCollapsed && (
                    <>
                        <h1 className="text-2xl font-bold truncate flex-1">Sophos.ai</h1>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleLeftSidebar}
                            className="h-8 w-8 flex-shrink-0"
                            title="Collapse sidebar"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </>
                )}
                {leftSidebarCollapsed && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleLeftSidebar}
                        className="h-8 w-8"
                        title="Expand sidebar"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {!leftSidebarCollapsed && (
                <>
                    <div className="flex-grow">
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Recent Uploads</h3>
                        <ul className="space-y-1">
                            {recentUploads.length > 0 ? (
                                recentUploads.map((file) => (
                                    <li key={file.id}>
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "w-full justify-start text-sm truncate font-normal hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors",
                                                currentDocumentId === file.documentId && "bg-accent"
                                            )}
                                            onClick={() => handleSelectDocument(file)}
                                            disabled={isLoading}
                                        >
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
                        {/* Add Content Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Add Content</h3>

                            {/* Try Sample Button - Only show for first-time users */}
                            {recentUploads.length === 0 && (
                                <div className="mb-3">
                                    <Button
                                        variant="outline"
                                        className="w-full border-dashed border-2 border-primary/50 hover:border-primary hover:bg-primary/5"
                                        onClick={handleTrySample}
                                        disabled={isLoading || loadingSample}
                                    >
                                        {loadingSample ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Loading Sample...
                                            </>
                                        ) : (
                                            <>
                                                Try Sample Document
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}

                            {/* YouTube URL Input */}
                            <div className="space-y-2 mb-3">
                                <label className="text-xs text-muted-foreground">Paste YouTube Link</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="https://youtube.com/watch?v=..."
                                        value={youtubeUrl}
                                        onChange={(e) => setYoutubeUrl(e.target.value)}
                                        disabled={isLoading}
                                        className="flex-1 text-sm"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleYoutubeSubmit();
                                            }
                                        }}
                                    />
                                    <Button
                                        onClick={handleYoutubeSubmit}
                                        disabled={isLoading || !youtubeUrl.trim()}
                                        size="sm"
                                    >
                                        Go
                                    </Button>
                                </div>
                            </div>
                            {/* Upload PDF Button */}
                            <label htmlFor="file-upload">
                                <Button
                                    variant="default"
                                    className="w-full"
                                    disabled={isLoading}
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload PDF"}
                                </Button>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    disabled={isLoading}
                                />
                            </label>
                        </div>
                        {/* Current Session */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Current Session</h3>
                            <p className="text-xs text-muted-foreground">
                                {recentUploads.find(f => f.documentId === currentDocumentId)?.name || "No document loaded"}
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/* Collapsed State - Show Icons Only */}
            {leftSidebarCollapsed && (
                <div className="flex flex-col items-center gap-4 h-full">
                    {recentUploads.slice(0, 3).map((file) => (
                        <Button
                            key={file.id}
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSelectDocument(file)}
                            disabled={isLoading}
                            title={file.name}
                            className={cn(
                                "w-12 h-12",
                                currentDocumentId === file.documentId && "bg-accent"
                            )}
                        >
                            <FileText className="w-5 h-5" />
                        </Button>
                    ))}
                    <div className="mt-auto">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => document.getElementById('file-upload')?.click()}
                            disabled={isLoading}
                            title="Upload PDF"
                            className="w-12 h-12"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                        </Button>
                        <input
                            id="file-upload"
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isLoading}
                        />
                    </div>
                </div>
            )}
        </aside>
    );
}
