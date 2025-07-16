import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Minimize2, Maximize2, MessageCircle } from 'lucide-react';

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
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
  const [isMinimized, setIsMinimized] = useState(false);

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
        <div className="h-[calc(400px-73px)]">
          {/* Document Content */}
          <ScrollArea className="h-full p-4">
            <div className="prose prose-sm max-w-none text-foreground">
              {section.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-3 text-sm leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </Card>
  );
};