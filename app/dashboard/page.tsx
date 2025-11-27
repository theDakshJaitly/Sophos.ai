// In app/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';

import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { RightPanel } from './components/RightPanel';
import { Node, Edge } from '@xyflow/react';
import { DashboardProvider } from './context/DashboardContext';

import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';

// Define a type for our concept map data for type safety
export interface UploadedFile {
  id: string;
  name: string;
  documentId?: string; // Database document ID for quiz generation
}

export interface WorkflowData {
  nodes: InputNode[];
  edges: InputEdge[];
  timeline?: any[];  // Timeline events from backend
  actionPlan?: any;  // Action plan from backend
  documentId?: string;
}

interface InputNode {
  id: string;
  label: string;
  description?: string;  // Brief explanation of the concept
  source?: string;       // Excerpt from document where concept appears
  position: { x: number; y: number };
}

interface InputEdge {
  id: string;
  source: string;
  target: string;
}

export default function DashboardPage() {
  // Keep Supabase JWT in localStorage for API calls
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      // Debug: log auth events to help diagnose unexpected sign-outs
      // This will appear in the browser console when sessions change
      // e.g. SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED
      console.debug('[supabase.auth] onAuthStateChange event=', event, 'session=', session);

      if (session?.access_token) {
        localStorage.setItem('token', session.access_token);
      } else {
        localStorage.removeItem('token');
      }
    });

    // Set token on first load
    // If this page was reached via OAuth redirect, Supabase returns the
    // session in the URL fragment (hash). Parse the fragment and persist
    // the access_token to localStorage so API calls can use it.
    try {
      if (typeof window !== 'undefined' && window.location.hash) {
        const hash = window.location.hash.substring(1); // remove '#'
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        if (accessToken) {
          console.debug('[supabase.auth] parsed access_token from URL fragment, persisting to localStorage');
          localStorage.setItem('token', accessToken);
          // Optionally persist refresh token if you use it elsewhere
          if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
          }
          // Remove fragment so it isn't visible/processed again
          try {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          } catch { }
        } else {
          // No fragment token present; fallback to reading the Supabase client session
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.access_token) {
              localStorage.setItem('token', session.access_token);
            }
          });
        }
      } else {
        // No fragment present; fallback to reading the Supabase client session
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.access_token) {
            localStorage.setItem('token', session.access_token);
          }
        });
      }
    } catch (err) {
      console.debug('[supabase.auth] error while parsing fragment', err);
    }

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);
  const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentUploads, setRecentUploads] = useState<UploadedFile[]>([]);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.debug('[supabase.auth] getSession() ->', session);
      if (!session) {
        // If no user is logged in, redirect to the login page
        router.push('/login');
      }
    };
    checkSession();
  }, [router]);

  return (
    <DashboardProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar
          setWorkflowData={setWorkflowData}
          setIsLoading={setIsLoading}
          recentUploads={recentUploads}
          setRecentUploads={setRecentUploads}
          setCurrentDocumentId={setCurrentDocumentId}
          currentDocumentId={currentDocumentId}
          isLoading={isLoading}
        />

        <MainContent
          workflowData={workflowData}
          isLoading={isLoading}
          currentDocumentId={currentDocumentId}
        />
        <RightPanel
          setWorkflowData={setWorkflowData}
          setIsLoading={setIsLoading}
          recentUploads={recentUploads}
          setRecentUploads={setRecentUploads}
          setCurrentDocumentId={setCurrentDocumentId}
          isLoading={isLoading}
        />
      </div>
    </DashboardProvider>
  );
}
