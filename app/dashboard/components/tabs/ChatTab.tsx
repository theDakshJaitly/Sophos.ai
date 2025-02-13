import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

function ChatMessage({ sender, message }: { sender: "user" | "ai"; message: string }) {
  return (
    <div className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-3/4 p-3 rounded-lg ${sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
        {message}
      </div>
    </div>
  )
}

export function ChatTab() {
  return (
    <div className="h-full flex flex-col relative">
      <div className="flex-1 overflow-auto p-4 space-y-4 pb-20">
        <ChatMessage sender="ai" message="Hello! How can I assist you with your study today?" />
        <ChatMessage sender="user" message="YOO Can you explain Linear Regression to me" />
        <ChatMessage
          sender="ai"
          message="Alright let me think and refer to relevant docs"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
        <form className="flex space-x-2">
          <Input placeholder="Type your message here..." className="flex-grow" />
          <Button type="submit">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}