import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatTab } from "./tabs/ChatTab";
import { WorkflowTab } from "./tabs/WorkflowTab";
import { NotesTab } from "./tabs/NotesTab";
import { QuizTab } from "./tabs/QuizTab";
import { Loader2} from "lucide-react";

interface MainContentProps {
  workflowData: { nodes: any[]; edges: any[] } | null;
  isLoading: boolean;
}

export function MainContent({ workflowData, isLoading }: MainContentProps) {
  const [activeTab, setActiveTab] = useState("workflow");
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
    <div className="flex-grow p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="flex-grow">
          <ChatTab />
        </TabsContent>
        <TabsContent value="workflow" className="h-full">
          <WorkflowTab data={workflowData} />
        </TabsContent>
        <TabsContent value="notes" className="h-full">
          <NotesTab />
        </TabsContent>
        <TabsContent value="quiz" className="h-full">
          <QuizTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

