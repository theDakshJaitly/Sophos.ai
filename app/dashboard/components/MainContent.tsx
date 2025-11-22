// In app/dashboard/components/MainContent.tsx

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkflowTab } from "./tabs/WorkflowTab"
import { ChatTab } from "./tabs/ChatTab"
import { NotesTab } from "./tabs/NotesTab"
import { QuizTab } from "./tabs/QuizTab"
import { Loader2 } from "lucide-react"
import { WorkflowData } from "../page"
import { useDashboard } from "../context/DashboardContext"
import { useRef } from "react"

interface MainContentProps {
  workflowData: WorkflowData | null;
  isLoading: boolean;
}

export function MainContent({ workflowData, isLoading }: MainContentProps) {
  const { setChatMessage, setTriggerChatSubmit } = useDashboard();
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleNodeClick = (nodeLabel: string) => {
    // Set the chat message
    setChatMessage(`Tell me more about ${nodeLabel}`);

    // Switch to chat tab
    const chatTrigger = document.querySelector('[data-value="chat"]') as HTMLButtonElement;
    if (chatTrigger) {
      chatTrigger.click();
    }

    // Trigger submit after a brief delay to ensure tab switch completes
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
      <Tabs ref={tabsRef} defaultValue="workflow" className="flex-1 flex flex-col min-h-0">
        <TabsList className="flex-shrink-0">
          <TabsTrigger value="workflow" data-value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="chat" data-value="chat">Chat</TabsTrigger>
          <TabsTrigger value="notes" data-value="notes">Notes</TabsTrigger>
          <TabsTrigger value="quiz" data-value="quiz">Quiz</TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="flex-1 min-h-0">
          <WorkflowTab data={workflowData} onNodeClick={handleNodeClick} />
        </TabsContent>
        <TabsContent value="chat" className="flex-1 min-h-0">
          <ChatTab />
        </TabsContent>
        <TabsContent value="notes" className="flex-1 min-h-0">
          <NotesTab />
        </TabsContent>
        <TabsContent value="quiz" className="flex-1 min-h-0">
          <QuizTab />
        </TabsContent>
      </Tabs>
    </main>
  )
}

