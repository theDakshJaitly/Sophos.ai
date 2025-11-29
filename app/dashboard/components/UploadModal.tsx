"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Youtube, Github, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onPdfUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onYoutubeSubmit: (url: string) => void;
    onGithubSubmit: (url: string) => void;
    isLoading: boolean;
}

export function UploadModal({
    open,
    onOpenChange,
    onPdfUpload,
    onYoutubeSubmit,
    onGithubSubmit,
    isLoading
}: UploadModalProps) {
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [githubUrl, setGithubUrl] = useState('');

    const handleYoutubeSubmit = () => {
        if (youtubeUrl.trim()) {
            onYoutubeSubmit(youtubeUrl);
            setYoutubeUrl('');
        }
    };

    const handleGithubSubmit = () => {
        if (githubUrl.trim()) {
            onGithubSubmit(githubUrl);
            setGithubUrl('');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px] bg-white/95 backdrop-blur-2xl border border-gray-200 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Upload Source
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Choose a source type to upload and analyze
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* PDF Upload Card */}
                    <div
                        className={cn(
                            "group relative rounded-xl border-2 p-6 transition-all duration-300",
                            "hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 cursor-pointer",
                            "bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm",
                            "border-gray-200 hover:border-primary/50",
                            isLoading && "opacity-50 cursor-not-allowed hover:scale-100"
                        )}
                        onClick={() => !isLoading && document.getElementById('modal-file-upload')?.click()}
                    >
                        <div className="flex items-start gap-4">
                            <div className="rounded-xl bg-primary/10 p-3 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1 text-gray-900">Upload PDF</h3>
                                <p className="text-sm text-gray-600">
                                    Upload a PDF document to analyze and extract insights
                                </p>
                            </div>
                        </div>
                        <input
                            id="modal-file-upload"
                            type="file"
                            accept="application/pdf"
                            onChange={onPdfUpload}
                            className="hidden"
                            disabled={isLoading}
                        />
                    </div>

                    {/* YouTube URL Card */}
                    <div
                        className={cn(
                            "rounded-xl border-2 p-6 transition-all duration-300",
                            "bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm",
                            "border-gray-200 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10",
                            isLoading && "opacity-50"
                        )}
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className="rounded-xl bg-red-500/10 p-3 hover:bg-red-500/20 transition-all duration-300">
                                <Youtube className="h-6 w-6 text-red-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1 text-gray-900">YouTube Video</h3>
                                <p className="text-sm text-gray-600">
                                    Enter a YouTube URL to process the video transcript
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="https://youtube.com/watch?v=..."
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                disabled={isLoading}
                                className="flex-1 bg-gray-50 border-gray-300 focus:border-red-500/50 text-gray-900 placeholder:text-gray-500"
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
                                className="bg-red-500/20 hover:bg-red-500/30 text-red-600 border border-red-500/30"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
                            </Button>
                        </div>
                    </div>

                    {/* GitHub URL Card */}
                    <div
                        className={cn(
                            "rounded-xl border-2 p-6 transition-all duration-300",
                            "bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm",
                            "border-gray-200 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10",
                            isLoading && "opacity-50"
                        )}
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className="rounded-xl bg-purple-500/10 p-3 hover:bg-purple-500/20 transition-all duration-300">
                                <Github className="h-6 w-6 text-purple-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1 text-gray-900">GitHub Repository</h3>
                                <p className="text-sm text-gray-600">
                                    Enter a GitHub repository URL to analyze the codebase
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="https://github.com/owner/repo"
                                value={githubUrl}
                                onChange={(e) => setGithubUrl(e.target.value)}
                                disabled={isLoading}
                                className="flex-1 bg-gray-50 border-gray-300 focus:border-purple-500/50 text-gray-900 placeholder:text-gray-500"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleGithubSubmit();
                                    }
                                }}
                            />
                            <Button
                                onClick={handleGithubSubmit}
                                disabled={isLoading || !githubUrl.trim()}
                                size="sm"
                                className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-600 border border-purple-500/30"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
