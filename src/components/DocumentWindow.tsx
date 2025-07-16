import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Send, Bot, User, FileText, Minimize2, Maximize2, MessageCircle } from 'lucide-react';

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface DocumentWindowProps {
  section: DocumentSection;
  onClose?: () => void;
  onDiscuss?: (section: DocumentSection) => void;
  className?: string;
  style?: React.CSSProperties;
  isActive?: boolean;
}

export const DocumentWindow = ({ 
  section, 
  onClose, 
  onDiscuss, 
  className, 
  style, 
  isActive = false 
}: DocumentWindowProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello! I'm the dedicated AI assistant for "${section.title}". I can help you dive deep into this specific section's content. What would you like to explore?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Generate section-specific AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateSectionResponse(inputValue, section),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputValue('');
  };

  const generateSectionResponse = (userInput: string, section: DocumentSection): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('summary') || lowerInput.includes('summarize')) {
      return `Here's a summary of "${section.title}": ${section.content.slice(0, 300)}... This section focuses specifically on ${section.title.toLowerCase()} aspects and provides detailed insights into this particular area.`;
    }
    
    if (lowerInput.includes('key points') || lowerInput.includes('main points')) {
      const sentences = section.content.split('.').filter(s => s.trim().length > 20);
      const keyPoints = sentences.slice(0, 3).map((s, i) => `${i + 1}. ${s.trim()}.`).join('\n');
      return `Key points from "${section.title}":\n\n${keyPoints}`;
    }
    
    if (lowerInput.includes('explain') || lowerInput.includes('what is')) {
      return `Based on "${section.title}", I can explain that ${section.content.split('.')[0]}. This section delves into the specifics of ${section.title.toLowerCase()} and provides comprehensive coverage of the topic.`;
    }
    
    return `Regarding "${userInput}" in the context of "${section.title}": ${section.content.slice(0, 200)}... I'm specifically focused on this section's content and can provide detailed analysis of how your question relates to ${section.title.toLowerCase()}.`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card 
      className={`bg-card border-border overflow-hidden transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-[400px]'
      } ${isActive ? 'ring-2 ring-ai-glow shadow-glow' : ''} ${className}`}
      style={style}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-ai-surface border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-ai-glow" />
          <h3 className="font-semibold text-foreground">{section.title}</h3>
          {isActive && (
            <div className="flex items-center gap-1 text-xs text-ai-glow">
              <div className="w-2 h-2 bg-ai-glow rounded-full animate-pulse"></div>
              Active in Chat
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onDiscuss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDiscuss(section)}
              className="h-8 px-2 hover:bg-ai-surface-hover text-ai-glow hover:text-ai-glow-soft"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Discuss
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 p-0 hover:bg-ai-surface-hover"
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
            >
              ×
            </Button>
          )}
        </div>
      </div>

      {!isMinimized && (
        <div className="flex h-[calc(400px-73px)]">
          {/* Document Content */}
          <div className="flex-1 bg-ai-document-bg">
            <div className="p-3 border-b border-border">
              <h4 className="text-xs font-medium text-muted-foreground">Section Content</h4>
            </div>
            <ScrollArea className="h-[calc(100%-41px)] p-3">
              <div className="prose prose-sm max-w-none text-foreground">
                {section.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-2 text-xs leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </ScrollArea>
          </div>

          <Separator orientation="vertical" />

          {/* Individual Section Chat */}
          <div className="w-64 bg-ai-chat-bg flex flex-col">
            <div className="p-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-ai-glow" />
                <h4 className="text-xs font-medium">Section AI</h4>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'assistant' && (
                      <div className="flex-shrink-0 w-6 h-6 bg-ai-glow/20 rounded-full flex items-center justify-center">
                        <Bot className="h-3 w-3 text-ai-glow" />
                      </div>
                    )}
                    <div
                      className={`max-w-[180px] p-2 rounded-lg text-xs ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground ml-6'
                          : 'bg-ai-surface text-foreground mr-6'
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.type === 'user' && (
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                        <User className="h-3 w-3 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about this section..."
                  className="bg-ai-surface border-border text-foreground placeholder:text-muted-foreground text-xs h-7"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-2 h-7"
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};