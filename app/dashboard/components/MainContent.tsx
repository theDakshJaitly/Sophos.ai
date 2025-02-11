import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

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
        </TabsList>
        <TabsContent value="chat" className="flex-grow flex flex-col">
          <div className="flex-grow overflow-auto p-4 space-y-4">
            <ChatMessage sender="ai" message="Hello! How can I assist you with your documents today?" />
            <ChatMessage sender="user" message="Can you summarize the main points of the last document I uploaded?" />
            <ChatMessage
              sender="ai"
              message="I'll analyze the last document you uploaded and provide a summary of its main points. Please give me a moment..."
            />
          </div>
          <div className="mt-auto">
            <form className="flex space-x-2">
              <Input placeholder="Type your message here..." className="flex-grow" />
              <Button type="submit">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </div>
        </TabsContent>
        <TabsContent value="workflow" className="h-full">
          <div className="h-full flex items-center justify-center text-gray-500">
            Workflow visualization coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ChatMessage({ sender, message }: { sender: "user" | "ai"; message: string }) {
  return (
    <div className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-3/4 p-3 rounded-lg ${sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
        {message}
      </div>
    </div>
  )
}

