import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatTab } from "./tabs/ChatTab";
import { WorkflowTab } from "./tabs/WorkflowTab";
import { NotesTab } from "./tabs/NotesTab";
import { QuizTab } from "./tabs/QuizTab";

interface MainContentProps {
  workflowData: { nodes: any[]; edges: any[] } | null;
}

export function MainContent({ workflowData }: MainContentProps) {
  const [activeTab, setActiveTab] = useState("workflow");

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

