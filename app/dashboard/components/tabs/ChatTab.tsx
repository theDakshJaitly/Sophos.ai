// In app/dashboard/components/tabs/ChatTab.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SendHorizonal, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {

      const { data: { session } } = await supabase.auth.getSession();
  
      if (!session) {
        throw new Error("User not authenticated");
      }



      const response = await axios.post<{ answer: string }>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat`,
        { message: input }
      );
      
      const assistantMessage: Message = { role: 'assistant', content: response.data.answer };
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      const errorMessageContent = (axios.isAxiosError(error) && error.response?.data?.message)
        ? error.response.data.message
        : "Sorry, I ran into an error. Please try again.";
      
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMessageContent }]);

      toast({
        variant: "destructive",
        title: "Chat Error",
        description: errorMessageContent,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden">
      {/* Fixed header */}
      <div className="flex-shrink-0 text-center p-4 border-b">
        <h2 className="text-xl font-semibold">Chat with your Documents</h2>
        <p className="text-sm text-muted-foreground">Ask anything about the content of your uploaded PDFs.</p>
      </div>
      
      {/* Scrollable messages area */}
      <ScrollArea className="flex-1 min-h-0" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback>{msg.role === 'user' ? 'U' : 'AI'}</AvatarFallback>
              </Avatar>
              <div className={`rounded-lg p-3 max-w-[70%] break-words ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="rounded-lg p-3 bg-muted flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Fixed input area */}
      <div className="flex-shrink-0 p-4 border-t bg-background">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="flex-grow"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}