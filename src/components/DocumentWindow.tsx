import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Send, Bot, User, FileText, Minimize2, Maximize2 } from 'lucide-react';

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
  className?: string;
  style?: React.CSSProperties;
}

export const DocumentWindow = ({ section, onClose, className, style }: DocumentWindowProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello! I'm here to help you with "${section.title}". What would you like to know about this section?`,
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

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I understand you're asking about "${inputValue}" in relation to ${section.title}. Based on this section, I can help you analyze the content and provide insights.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputValue('');
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
        isMinimized ? 'h-16' : 'h-[600px]'
      } ${className}`}
      style={style}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-ai-surface border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-ai-glow" />
          <h3 className="font-semibold text-foreground">{section.title}</h3>
        </div>
        <div className="flex items-center gap-2">
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
        <div className="flex h-[calc(600px-73px)]">
          {/* Document Content */}
          <div className="flex-1 bg-ai-document-bg">
            <div className="p-4 border-b border-border">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Document Content</h4>
            </div>
            <ScrollArea className="h-[calc(100%-57px)] p-4">
              <div className="prose prose-sm max-w-none text-foreground">
                {section.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3 text-sm leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </ScrollArea>
          </div>

          <Separator orientation="vertical" />

          {/* Chat Interface */}
          <div className="w-80 bg-ai-chat-bg flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-ai-glow" />
                <h4 className="text-sm font-medium">AI Assistant</h4>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-ai-glow/20 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-ai-glow" />
                      </div>
                    )}
                    <div
                      className={`max-w-[240px] p-3 rounded-lg text-sm ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground ml-8'
                          : 'bg-ai-surface text-foreground mr-8'
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.type === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about this section..."
                  className="bg-ai-surface border-border text-foreground placeholder:text-muted-foreground"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};