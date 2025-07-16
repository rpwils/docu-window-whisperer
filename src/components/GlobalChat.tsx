import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, FileText } from 'lucide-react';
import { DocumentSection } from './DocumentWindow';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  referencedSection?: string;
}

interface GlobalChatProps {
  sections: DocumentSection[];
  activeSection: DocumentSection | null;
  onSectionReference?: (sectionId: string) => void;
}

export const GlobalChat = ({ sections, activeSection, onSectionReference }: GlobalChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello! I'm your AI assistant and I can help you with all ${sections.length} document sections. I can analyze, summarize, compare, or answer questions about any content across all sections. What would you like to explore?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    // Check if user is asking about a specific section
    const mentionedSection = sections.find(section => 
      lowerInput.includes(section.title.toLowerCase()) ||
      lowerInput.includes(section.id)
    );

    if (mentionedSection) {
      return `I can see you're asking about "${mentionedSection.title}". Based on that section, ${mentionedSection.content.slice(0, 200)}... Would you like me to elaborate on any specific aspect of this section?`;
    }

    // Check for comparison requests
    if (lowerInput.includes('compare') || lowerInput.includes('difference')) {
      return `I can help you compare different sections. Currently, I have access to ${sections.map(s => s.title).join(', ')}. Which sections would you like me to compare specifically?`;
    }

    // Check for summary requests
    if (lowerInput.includes('summary') || lowerInput.includes('summarize')) {
      return `I can provide summaries of any or all sections. Here's a brief overview of available sections: ${sections.map(s => `"${s.title}"`).join(', ')}. Which section(s) would you like me to summarize?`;
    }

    // General response referencing active section if available
    if (activeSection) {
      return `I understand your question about "${userInput}". ${activeSection ? `Since you were discussing "${activeSection.title}", ` : ''}I can help you analyze this across all document sections. Based on the available content, I can provide insights and connections between different sections.`;
    }

    return `That's an interesting question about "${userInput}". I have access to all ${sections.length} document sections and can help you find relevant information, make connections between sections, or provide detailed analysis. Would you like me to search across specific sections?`;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
      referencedSection: activeSection?.id
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response with typing delay
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputValue),
        timestamp: new Date(),
        referencedSection: activeSection?.id
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);

    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSectionTitle = (sectionId?: string) => {
    if (!sectionId) return null;
    return sections.find(s => s.id === sectionId)?.title;
  };

  return (
    <Card className="h-full bg-ai-chat-bg border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-ai-surface">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-ai-glow" />
            <h2 className="font-semibold text-foreground">Global AI Assistant</h2>
          </div>
          <Badge variant="secondary" className="text-xs">
            {sections.length} Sections Available
          </Badge>
        </div>
        {activeSection && (
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            Currently discussing: <span className="text-ai-glow">{activeSection.title}</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-fade-in ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 bg-ai-glow/20 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-ai-glow" />
                </div>
              )}
              <div className="max-w-[80%] space-y-2">
                {message.referencedSection && (
                  <div className="text-xs text-muted-foreground">
                    Referenced: {getSectionTitle(message.referencedSection)}
                  </div>
                )}
                <div
                  className={`p-3 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-ai-surface text-foreground'
                  }`}
                >
                  {message.content}
                </div>
                <div className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
              {message.type === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <div className="flex-shrink-0 w-8 h-8 bg-ai-glow/20 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-ai-glow" />
              </div>
              <div className="bg-ai-surface p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-ai-glow rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-ai-glow rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-ai-glow rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="p-3 border-t border-border bg-ai-surface/50">
        <div className="flex gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputValue('Can you summarize all sections?')}
            className="text-xs h-7 bg-ai-surface hover:bg-ai-surface-hover"
          >
            Summarize All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputValue('Compare the main sections')}
            className="text-xs h-7 bg-ai-surface hover:bg-ai-surface-hover"
          >
            Compare Sections
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputValue('What are the key insights?')}
            className="text-xs h-7 bg-ai-surface hover:bg-ai-surface-hover"
          >
            Key Insights
          </Button>
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about any section or compare across all documents..."
            className="bg-ai-surface border-border text-foreground placeholder:text-muted-foreground"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            disabled={isTyping || !inputValue.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};