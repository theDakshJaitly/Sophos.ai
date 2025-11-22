'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Lightbulb, Hash } from 'lucide-react';

interface NotesTabProps {
  documentId?: string;
  documentName?: string;
  documentData?: any; // The full workflow data with concepts, timeline, actionPlan
}

export function NotesTab({ documentId, documentName, documentData }: NotesTabProps) {
  const [notes, setNotes] = useState('');
  const STORAGE_KEY = `sophos_notes_${documentId || 'default'}`;

  // Load notes from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && documentId) {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotes(stored);
      } else {
        // Auto-generate notes from document data
        setNotes(generateNotesFromData(documentName || 'Document', documentData));
      }
    }
  }, [documentId, STORAGE_KEY, documentName, documentData]);

  // Save notes to sessionStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && documentId && notes) {
      sessionStorage.setItem(STORAGE_KEY, notes);
    }
  }, [notes, documentId, STORAGE_KEY]);

  const generateNotesFromData = (docName: string, data: any) => {
    let notesContent = `# Notes for ${docName}\n\n`;

    // Main Topics from concepts
    notesContent += `## 📚 Main Topics\n`;
    if (data?.nodes && data.nodes.length > 0) {
      const topNodes = data.nodes.slice(0, 5); // Get first 5 main topics
      topNodes.forEach((node: any) => {
        notesContent += `- **${node.label}**`;
        if (node.description) {
          notesContent += `: ${node.description}`;
        }
        notesContent += `\n`;
      });
    } else {
      notesContent += `- No topics extracted yet\n`;
    }

    notesContent += `\n`;

    // Key Concepts with definitions
    notesContent += `## 💡 Key Concepts\n`;
    if (data?.nodes && data.nodes.length > 0) {
      const conceptNodes = data.nodes.slice(0, 8); // Get first 8 concepts
      conceptNodes.forEach((node: any) => {
        notesContent += `**${node.label}**`;
        if (node.description) {
          notesContent += `: ${node.description}`;
        } else {
          notesContent += `: [Key concept from document]`;
        }
        notesContent += `\n\n`;
      });
    } else {
      notesContent += `No concepts extracted yet\n\n`;
    }

    // Important Points from action plan
    notesContent += `## 📝 Important Points\n`;
    if (data?.actionPlan?.phases && data.actionPlan.phases.length > 0) {
      data.actionPlan.phases.forEach((phase: any) => {
        notesContent += `- **${phase.title}**: ${phase.description || ''}\n`;
      });
    } else if (data?.timeline && data.timeline.length > 0) {
      // Use timeline events if no action plan
      data.timeline.slice(0, 5).forEach((event: any) => {
        notesContent += `- ${event.title || event.description}\n`;
      });
    } else {
      notesContent += `- No key points extracted yet\n`;
    }

    notesContent += `\n`;

    // Questions section (empty for user to fill)
    notesContent += `## ❓ Questions\n`;
    notesContent += `- \n`;
    notesContent += `- \n\n`;

    // Summary
    notesContent += `## 📌 Summary\n`;
    if (data?.actionPlan?.phases && data.actionPlan.phases.length > 0) {
      notesContent += `This document covers ${data.actionPlan.phases.length} main phases: `;
      notesContent += data.actionPlan.phases.map((p: any) => p.title).join(', ');
      notesContent += `.`;
    } else if (data?.nodes && data.nodes.length > 0) {
      notesContent += `This document contains ${data.nodes.length} key concepts `;
      notesContent += `including ${data.nodes.slice(0, 3).map((n: any) => n.label).join(', ')}`;
      if (data.nodes.length > 3) {
        notesContent += ` and ${data.nodes.length - 3} more`;
      }
      notesContent += `.`;
    } else {
      notesContent += `[Auto-generated summary will appear here once document is processed]`;
    }

    return notesContent;
  };

  if (!documentId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Upload a document to start taking notes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 gap-4">
      {/* Header Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="backdrop-blur-lg bg-white/5 dark:bg-gray-900/10 border-white/10 dark:border-gray-700/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <BookOpen className="h-3 w-3" />
              Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {documentData?.nodes?.length || 0} topics extracted
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-lg bg-white/5 dark:bg-gray-900/10 border-white/10 dark:border-gray-700/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Lightbulb className="h-3 w-3" />
              Concepts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {documentData?.nodes?.length || 0} key concepts
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-lg bg-white/5 dark:bg-gray-900/10 border-white/10 dark:border-gray-700/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Hash className="h-3 w-3" />
              Phases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {documentData?.actionPlan?.phases?.length || 0} action phases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notes Editor */}
      <Card className="flex-1 backdrop-blur-lg bg-white/5 dark:bg-gray-900/10 border-white/10 dark:border-gray-700/20 flex flex-col">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">📝 Your Notes</CardTitle>
          <p className="text-xs text-muted-foreground">
            Auto-generated from document. Edit as needed - saves automatically!
          </p>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Start taking notes..."
            className="flex-1 min-h-[400px] font-mono text-sm resize-none
              bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </CardContent>
      </Card>

      {/* Footer Hint */}
      <p className="text-xs text-muted-foreground text-center">
        💡 Tip: Notes are stored in your browser session and will clear when you close the tab
      </p>
    </div>
  );
}