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
    const words = lowerInput.split(' ');
    
    // Check if user is asking about a specific section
    const mentionedSection = sections.find(section => 
      lowerInput.includes(section.title.toLowerCase()) ||
      section.title.toLowerCase().split(' ').some(word => lowerInput.includes(word))
    );

    // Analysis functions
    const analyzeSection = (section: DocumentSection) => {
      const content = section.content;
      const sentences = content.split('.').filter(s => s.trim().length > 0);
      const wordCount = content.split(' ').length;
      const keyTerms = extractKeyTerms(content);
      
      return {
        wordCount,
        sentenceCount: sentences.length,
        keyTerms,
        summary: content.slice(0, 200) + '...',
        mainThemes: identifyThemes(content)
      };
    };

    const extractKeyTerms = (text: string): string[] => {
      const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'a', 'an'];
      const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
      const wordFreq: { [key: string]: number } = {};
      
      words.forEach(word => {
        if (!commonWords.includes(word)) {
          wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
      });
      
      return Object.entries(wordFreq)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 5)
        .map(([word]) => word);
    };

    const identifyThemes = (text: string) => {
      const aiTerms = ['artificial intelligence', 'ai', 'machine learning', 'neural', 'algorithm', 'data', 'model', 'training'];
      const mlTerms = ['supervised', 'unsupervised', 'classification', 'regression', 'clustering', 'feature'];
      const deepLearningTerms = ['deep learning', 'neural network', 'cnn', 'rnn', 'transformer', 'layer'];
      
      const themes = [];
      if (aiTerms.some(term => text.toLowerCase().includes(term))) themes.push('Artificial Intelligence');
      if (mlTerms.some(term => text.toLowerCase().includes(term))) themes.push('Machine Learning');
      if (deepLearningTerms.some(term => text.toLowerCase().includes(term))) themes.push('Deep Learning');
      
      return themes;
    };

    const compareMultipleSections = (sectionsToCompare: DocumentSection[]) => {
      const analyses = sectionsToCompare.map(analyzeSection);
      const totalWords = analyses.reduce((sum, analysis) => sum + analysis.wordCount, 0);
      const allThemes = [...new Set(analyses.flatMap(a => a.mainThemes))];
      const commonTerms = analyses.reduce((common, analysis) => 
        common.filter(term => analysis.keyTerms.includes(term)), 
        analyses[0]?.keyTerms || []
      );

      return {
        sectionsCount: sectionsToCompare.length,
        totalWords,
        averageWords: Math.round(totalWords / sectionsToCompare.length),
        commonThemes: allThemes,
        commonTerms,
        analyses
      };
    };

    // Enhanced response generation based on input patterns
    
    // Specific section analysis
    if (mentionedSection) {
      const analysis = analyzeSection(mentionedSection);
      
      if (lowerInput.includes('analyze') || lowerInput.includes('analysis')) {
        return `## Analysis of "${mentionedSection.title}"

**Content Overview:**
- Word count: ${analysis.wordCount} words
- ${analysis.sentenceCount} sentences
- Main themes: ${analysis.mainThemes.join(', ') || 'General content'}

**Key Terms:** ${analysis.keyTerms.join(', ')}

**Summary:** ${analysis.summary}

**Key Insights:** This section focuses on ${analysis.mainThemes.length > 0 ? analysis.mainThemes[0].toLowerCase() : 'the topic'} and provides ${analysis.sentenceCount > 10 ? 'comprehensive' : 'foundational'} coverage of the subject matter.`;
      }
      
      if (lowerInput.includes('summary') || lowerInput.includes('summarize')) {
        return `## Summary of "${mentionedSection.title}"

${analysis.summary}

**Main Focus:** ${analysis.mainThemes.join(' and ') || 'Core concepts'}
**Key Terms:** ${analysis.keyTerms.slice(0, 3).join(', ')}
**Scope:** ${analysis.wordCount > 200 ? 'Detailed' : 'Concise'} overview with ${analysis.sentenceCount} key points covered.`;
      }

      return `I can see you're asking about "${mentionedSection.title}". This section covers ${analysis.mainThemes.join(' and ').toLowerCase() || 'important concepts'} with key focus on: ${analysis.keyTerms.slice(0, 3).join(', ')}. 

${analysis.summary}

Would you like me to provide a deeper analysis, compare it with other sections, or focus on specific aspects?`;
    }

    // Multi-section comparison
    if (lowerInput.includes('compare') || lowerInput.includes('comparison') || lowerInput.includes('difference')) {
      const comparison = compareMultipleSections(sections);
      
      return `## Multi-Section Comparison Analysis

**Document Overview:**
- ${comparison.sectionsCount} sections analyzed
- Total content: ${comparison.totalWords} words
- Average section length: ${comparison.averageWords} words

**Common Themes Across Sections:**
${comparison.commonThemes.map(theme => `• ${theme}`).join('\n')}

**Shared Key Terms:** ${comparison.commonTerms.join(', ') || 'Each section has unique terminology'}

**Section Breakdown:**
${comparison.analyses.map((analysis, i) => 
  `**${sections[i].title}:** ${analysis.wordCount} words, focuses on ${analysis.mainThemes.join(' & ') || 'core concepts'}`
).join('\n')}

**Analysis:** ${comparison.commonThemes.length > 1 ? 'The sections show strong thematic connections' : 'Each section covers distinct aspects'}, with ${comparison.commonTerms.length > 0 ? 'overlapping terminology indicating related concepts' : 'specialized vocabulary for each topic'}.`;
    }

    // Document-wide summary
    if (lowerInput.includes('summary') || lowerInput.includes('summarize') || lowerInput.includes('overview')) {
      const fullAnalysis = compareMultipleSections(sections);
      
      return `## Complete Document Summary

**Document Structure:** ${sections.length} main sections covering ${fullAnalysis.totalWords} words total

**Section Overview:**
${sections.map((section, i) => {
  const analysis = analyzeSection(section);
  return `**${section.title}:** ${analysis.keyTerms.slice(0, 2).join(', ')} (${analysis.wordCount} words)`;
}).join('\n')}

**Main Themes:** ${fullAnalysis.commonThemes.join(', ')}

**Document Narrative:** This document provides a ${fullAnalysis.totalWords > 1000 ? 'comprehensive' : 'foundational'} exploration of ${fullAnalysis.commonThemes[0]?.toLowerCase() || 'the subject matter'}, progressing from ${sections[0]?.title.toLowerCase()} through to ${sections[sections.length - 1]?.title.toLowerCase()}.

**Key Insights:** ${fullAnalysis.commonTerms.length > 0 ? `Common concepts include ${fullAnalysis.commonTerms.slice(0, 3).join(', ')}, indicating strong thematic coherence.` : 'Each section contributes unique perspectives to the overall narrative.'}`;
    }

    // Question answering across sections
    if (lowerInput.includes('what') || lowerInput.includes('how') || lowerInput.includes('why') || lowerInput.includes('?')) {
      const relevantSections = sections.filter(section => 
        words.some(word => section.content.toLowerCase().includes(word) || section.title.toLowerCase().includes(word))
      );

      if (relevantSections.length > 0) {
        const insights = relevantSections.map(section => {
          const analysis = analyzeSection(section);
          return `**From "${section.title}":** ${analysis.summary}`;
        }).join('\n\n');

        return `## Answer Based on Document Analysis

**Relevant Sections Found:** ${relevantSections.length} of ${sections.length} sections contain related information.

${insights}

**Cross-Section Insight:** ${relevantSections.length > 1 ? 'Multiple sections provide complementary perspectives on your question.' : 'This topic is primarily covered in one section.'} ${activeSection ? `Since you're currently focused on "${activeSection.title}", I can provide more specific details from that context.` : ''}`;
      }
    }

    // Key insights and patterns
    if (lowerInput.includes('insight') || lowerInput.includes('pattern') || lowerInput.includes('key') || lowerInput.includes('important')) {
      const fullAnalysis = compareMultipleSections(sections);
      
      return `## Key Insights & Patterns

**Document Patterns:**
• **Progression:** ${sections[0]?.title} → ${sections[sections.length - 1]?.title}
• **Complexity:** ${fullAnalysis.averageWords > 150 ? 'Detailed explanations' : 'Concise coverage'}
• **Thematic Unity:** ${fullAnalysis.commonThemes.length} shared themes

**Critical Insights:**
${fullAnalysis.commonThemes.map(theme => `• **${theme}:** Appears across ${sections.filter(s => analyzeSection(s).mainThemes.includes(theme)).length} sections`).join('\n')}

**Content Distribution:**
${sections.map(section => {
  const analysis = analyzeSection(section);
  return `• **${section.title}:** ${analysis.wordCount} words, ${Math.round((analysis.wordCount / fullAnalysis.totalWords) * 100)}% of total content`;
}).join('\n')}

**Recommendation:** ${activeSection ? `Focus on "${activeSection.title}" provides ${analyzeSection(activeSection).mainThemes.join(' and ').toLowerCase()} foundation.` : 'Start with the introduction for foundational understanding.'}`;
    }

    // Context-aware general response
    const contextResponse = activeSection ? 
      `Since you're currently discussing "${activeSection.title}", I can provide specific insights about ${analyzeSection(activeSection).mainThemes.join(' and ').toLowerCase() || 'this content'}.` : 
      'I have access to all document sections and can provide comprehensive analysis.';

    return `I understand your question about "${userInput}". ${contextResponse}

**Available Analysis Options:**
• **Section Analysis:** Deep dive into any specific section
• **Comparative Analysis:** Compare themes and concepts across sections  
• **Document Summary:** Overall insights and key patterns
• **Q&A:** Answer specific questions using content from relevant sections

**Current Document:** ${sections.length} sections covering ${compareMultipleSections(sections).commonThemes.join(', ').toLowerCase() || 'various topics'}

What specific aspect would you like me to explore further?`;
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