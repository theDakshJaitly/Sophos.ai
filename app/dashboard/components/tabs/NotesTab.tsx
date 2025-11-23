'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Lightbulb, Hash } from 'lucide-react';

interface NotesTabProps {
  documentId?: string;
  documentName?: string;
  documentData?: any;
}

export function NotesTab({ documentId, documentName, documentData }: NotesTabProps) {
  if (!documentId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Upload a document to start viewing notes</p>
        </div>
      </div>
    );
  }

  // Extract data for display
  const topics = documentData?.nodes?.slice(0, 5) || [];
  const concepts = documentData?.nodes?.slice(0, 8) || [];
  const phases = documentData?.actionPlan?.phases || [];
  const timelineEvents = documentData?.timeline?.slice(0, 5) || [];

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">📝 Notes for {documentName}</h2>
        <p className="text-sm text-muted-foreground">Auto-generated from your document</p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="backdrop-blur-lg bg-white/5 dark:bg-gray-900/10 border-white/10 dark:border-gray-700/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <BookOpen className="h-3 w-3" />
              Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{topics.length}</p>
            <p className="text-xs text-muted-foreground">extracted</p>
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
            <p className="text-lg font-semibold">{concepts.length}</p>
            <p className="text-xs text-muted-foreground">key concepts</p>
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
            <p className="text-lg font-semibold">{phases.length}</p>
            <p className="text-xs text-muted-foreground">action phases</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Topics Section */}
      <Card className="backdrop-blur-lg bg-white/5 dark:bg-gray-900/10 border-white/10 dark:border-gray-700/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Main Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topics.length > 0 ? (
            <ul className="space-y-2">
              {topics.map((node: any, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <div>
                    <strong className="font-semibold">{node.label}</strong>
                    {node.description && (
                      <p className="text-sm text-muted-foreground mt-0.5">{node.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No topics extracted yet</p>
          )}
        </CardContent>
      </Card>

      {/* Key Concepts Section */}
      <Card className="backdrop-blur-lg bg-white/5 dark:bg-gray-900/10 border-white/10 dark:border-gray-700/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Key Concepts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {concepts.length > 0 ? (
            <div className="space-y-3">
              {concepts.map((node: any, idx: number) => (
                <div key={idx}>
                  <h4 className="font-semibold">{node.label}</h4>
                  <p className="text-sm text-muted-foreground">
                    {node.description || 'Key concept from document'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No concepts extracted yet</p>
          )}
        </CardContent>
      </Card>

      {/* Important Points Section */}
      <Card className="backdrop-blur-lg bg-white/5 dark:bg-gray-900/10 border-white/10 dark:border-gray-700/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Important Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          {phases.length > 0 ? (
            <ul className="space-y-2">
              {phases.map((phase: any, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <div>
                    <strong className="font-semibold">{phase.title}</strong>
                    {phase.description && (
                      <p className="text-sm text-muted-foreground mt-0.5">{phase.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : timelineEvents.length > 0 ? (
            <ul className="space-y-2">
              {timelineEvents.map((event: any, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm">{event.title || event.description}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No key points extracted yet</p>
          )}
        </CardContent>
      </Card>

      {/* Summary Section */}
      <Card className="backdrop-blur-lg bg-white/5 dark:bg-gray-900/10 border-white/10 dark:border-gray-700/20">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">
            {phases.length > 0 ? (
              <>
                This document covers <strong>{phases.length} main phases</strong>:{' '}
                {phases.map((p: any) => p.title).join(', ')}.
              </>
            ) : concepts.length > 0 ? (
              <>
                This document contains <strong>{concepts.length} key concepts</strong> including{' '}
                {concepts.slice(0, 3).map((n: any) => n.label).join(', ')}
                {concepts.length > 3 && ` and ${concepts.length - 3} more`}.
              </>
            ) : (
              'Auto-generated summary will appear here once document is processed.'
            )}
          </p>
        </CardContent>
      </Card>

      {/* Footer */}
      <p className="text-xs text-muted-foreground text-center pb-4">
        💡 Notes are automatically generated from your document's content
      </p>
    </div>
  );
}