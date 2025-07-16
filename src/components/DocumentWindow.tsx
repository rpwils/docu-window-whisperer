import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Send, Bot, User, FileText, Minimize2, Maximize2, MessageCircle, BarChart3 } from 'lucide-react';

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

  // Sample chart data based on section type
  const getChartData = () => {
    const sectionTitle = section.title.toLowerCase();
    
    if (sectionTitle.includes('strengths')) {
      return {
        type: 'bar',
        data: [
          { name: 'Innovation', value: 85, color: '#22c55e' },
          { name: 'Quality', value: 92, color: '#3b82f6' },
          { name: 'Support', value: 78, color: '#8b5cf6' },
          { name: 'Performance', value: 88, color: '#f59e0b' },
          { name: 'Usability', value: 81, color: '#ef4444' }
        ]
      };
    } else if (sectionTitle.includes('weaknesses')) {
      return {
        type: 'pie',
        data: [
          { name: 'Cost Issues', value: 35, color: '#ef4444' },
          { name: 'Complexity', value: 25, color: '#f97316' },
          { name: 'Learning Curve', value: 20, color: '#eab308' },
          { name: 'Integration', value: 20, color: '#84cc16' }
        ]
      };
    } else {
      return {
        type: 'line',
        data: [
          { month: 'Jan', value: 65 },
          { month: 'Feb', value: 72 },
          { month: 'Mar', value: 68 },
          { month: 'Apr', value: 85 },
          { month: 'May', value: 91 },
          { month: 'Jun', value: 88 }
        ]
      };
    }
  };

  const chartData = getChartData();

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
          {/* Document Content and Charts */}
          <div className="flex-1 bg-ai-document-bg">
            <Tabs defaultValue="content" className="h-full">
              <div className="p-3 border-b border-border">
                <TabsList className="grid w-full grid-cols-2 h-8">
                  <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
                  <TabsTrigger value="charts" className="text-xs">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Charts
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="content" className="h-[calc(100%-57px)] m-0">
                <ScrollArea className="h-full p-3">
                  <div className="prose prose-sm max-w-none text-foreground">
                    {section.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-2 text-xs leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="charts" className="h-[calc(100%-57px)] m-0">
                <div className="p-3 h-full">
                  <div className="h-full flex flex-col">
                    <h4 className="text-xs font-medium text-muted-foreground mb-3">
                      Visual Analysis - {section.title}
                    </h4>
                    
                    <div className="flex-1 min-h-0">
                      <div className="h-full w-full">
                        {chartData.type === 'bar' && (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData.data}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                              <XAxis 
                                dataKey="name" 
                                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                                interval={0}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                              />
                              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                              <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                                {chartData.data.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                        
                        {chartData.type === 'pie' && (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={chartData.data}
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                              >
                                {chartData.data.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        )}
                        
                        {chartData.type === 'line' && (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData.data}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                              <XAxis 
                                dataKey="month" 
                                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} 
                              />
                              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                              <Line 
                                type="monotone" 
                                dataKey="value" 
                                stroke="hsl(var(--primary))" 
                                strokeWidth={2}
                                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 3 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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