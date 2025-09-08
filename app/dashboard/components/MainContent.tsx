import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatTab } from "./tabs/ChatTab"
import { WorkflowTab } from "./tabs/WorkflowTab"
import { NotesTab } from "./tabs/NotesTab"
import { QuizTab } from "./tabs/QuizTab"

interface MainContentProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function MainContent({ activeTab, setActiveTab }: MainContentProps) {
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
          <WorkflowTab />
        </TabsContent>
        <TabsContent value="notes" className="h-full">
          <NotesTab />
        </TabsContent>
        <TabsContent value="quiz" className="h-full">
          <QuizTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

