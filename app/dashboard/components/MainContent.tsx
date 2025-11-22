import { WorkflowTab } from "./tabs/WorkflowTab"
import { ChatTab } from "./tabs/ChatTab"
import { NotesTab } from "./tabs/NotesTab"
import { QuizTab } from "./tabs/QuizTab"
import { Loader2 } from "lucide-react"
import { WorkflowData } from "../page"
import { useDashboard } from "../context/DashboardContext"
import { LensSwitcher } from "./LensSwitcher"

interface MainContentProps {
  workflowData: WorkflowData | null;
  isLoading: boolean;
  currentDocumentId: string | null;
}

export function MainContent({ workflowData, isLoading, currentDocumentId }: MainContentProps) {
  const {
    setChatMessage,
    setTriggerChatSubmit,
    activeMode,
    setActiveMode,
    workflowSubView,
    setWorkflowSubView
  } = useDashboard();

  const handleNodeClick = (nodeLabel: string) => {
    // Set the chat message
    setChatMessage(`Tell me more about ${nodeLabel}`);

    // Switch to chat mode
    setActiveMode('chat');

    // Trigger submit after a brief delay to ensure mode switch completes
    setTimeout(() => {
      setTriggerChatSubmit(true);
    }, 100);
  };

  if (isLoading) {
    return (
      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <h2 className="mt-4 text-2xl font-semibold">Analyzing Document</h2>
          <p className="mt-2 text-muted-foreground">
            Extracting concepts and building your knowledge graph...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 flex flex-col min-h-0">
      {/* Top Header: Workflow Switcher (Only visible in Workflow mode) */}
      <div className="flex items-center justify-between mb-6 h-12">
        <h1 className="text-2xl font-bold capitalize">{activeMode}</h1>

        {activeMode === 'workflow' && (
          <LensSwitcher viewMode={workflowSubView} setViewMode={setWorkflowSubView} />
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 border rounded-lg bg-white dark:bg-gray-900 shadow-sm overflow-hidden relative">
        {activeMode === 'workflow' && (
          <WorkflowTab
            data={workflowData}
            onNodeClick={handleNodeClick}
            viewMode={workflowSubView}
          />
        )}

        {activeMode === 'chat' && (
          <div className="h-full flex flex-col">
            <ChatTab />
          </div>
        )}

        {activeMode === 'notes' && (
          <div className="h-full flex flex-col">
            <NotesTab
              documentId={currentDocumentId || undefined}
              documentName="Document"
              documentData={workflowData}
            />
          </div>
        )}

        {activeMode === 'quiz' && (
          <div className="h-full flex flex-col">
            <QuizTab currentDocumentId={currentDocumentId} />
          </div>
        )}
      </div>
    </main>
  )
}
