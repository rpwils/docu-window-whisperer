import { useState } from 'react';
import { DocumentWindow, DocumentSection } from './DocumentWindow';
import { GlobalChat } from './GlobalChat';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, FileText, Sparkles, MessageSquare } from 'lucide-react';

const defaultSections: DocumentSection[] = [
  {
    id: '1',
    title: 'Introduction',
    content: `This document provides a comprehensive overview of artificial intelligence and machine learning concepts. In this section, we explore the fundamental principles that govern AI systems and their applications in modern technology.

Artificial Intelligence represents one of the most significant technological advances of our time. It encompasses various techniques and methodologies that enable machines to simulate human cognitive functions such as learning, reasoning, and problem-solving.

The field has evolved rapidly from simple rule-based systems to sophisticated neural networks capable of processing vast amounts of data and making complex decisions. This evolution has opened new possibilities across industries including healthcare, finance, transportation, and entertainment.`
  },
  {
    id: '2',
    title: 'Product Strengths',
    content: `Machine Learning is a subset of artificial intelligence that focuses on creating systems that can learn and improve from experience without being explicitly programmed. This approach has revolutionized how we solve complex problems and extract insights from data.

There are three main types of machine learning: supervised learning, unsupervised learning, and reinforcement learning. Each type serves different purposes and is suitable for different kinds of problems.

Supervised learning uses labeled training data to learn a mapping from inputs to outputs. Common examples include image classification, spam detection, and predictive modeling. The algorithm learns from examples and can then make predictions on new, unseen data.

Unsupervised learning, on the other hand, works with unlabeled data to discover hidden patterns or structures. This includes techniques like clustering, dimensionality reduction, and association rule learning.`
  },
  {
    id: '3',
    title: 'Product Weaknesses',
    content: `Neural networks are computational models inspired by the human brain's structure and function. They consist of interconnected nodes (neurons) organized in layers that process information and learn complex patterns from data.

Deep learning is a specialized form of machine learning that uses neural networks with multiple hidden layers. These deep networks can automatically learn hierarchical representations of data, making them particularly effective for tasks like image recognition, natural language processing, and speech recognition.

The power of deep learning lies in its ability to automatically discover relevant features from raw data. Traditional machine learning approaches often required manual feature engineering, but deep learning models can learn these features automatically through the training process.

Convolutional Neural Networks (CNNs) have been particularly successful in computer vision tasks, while Recurrent Neural Networks (RNNs) and Transformers have shown remarkable performance in natural language processing applications.`
  }
];

export const MultiDocumentChat = () => {
  const [sections, setSections] = useState<DocumentSection[]>(defaultSections);
  const [nextId, setNextId] = useState(4);
  const [activeSection, setActiveSection] = useState<DocumentSection | null>(null);

  const addNewSection = () => {
    const newSection: DocumentSection = {
      id: nextId.toString(),
      title: `Section ${nextId}`,
      content: `This is a new section that has been dynamically added to the document. You can customize this content and interact with the AI assistant about this specific section.

This demonstrates the dynamic nature of the interface, where new document sections can be added on demand. The global AI assistant can help you analyze, summarize, or answer questions about any content in this section.

The AI can help you analyze, summarize, or answer questions about any content in this section. Try asking specific questions about the text or requesting explanations of complex concepts.`
    };
    
    setSections(prev => [...prev, newSection]);
    setNextId(prev => prev + 1);
  };

  const removeSection = (id: string) => {
    setSections(prev => prev.filter(section => section.id !== id));
    if (activeSection?.id === id) {
      setActiveSection(null);
    }
  };

  const handleDiscussSection = (section: DocumentSection) => {
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-ai-surface/50 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-ai-glow/20 rounded-lg">
              <Sparkles className="h-6 w-6 text-ai-glow" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Multi-Document AI Chat</h1>
              <p className="text-muted-foreground">One AI assistant for all your document sections</p>
            </div>
          </div>
          <Button 
            onClick={addNewSection}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Section
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <Card className="p-4 mb-6 bg-ai-surface border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-ai-glow" />
                <span className="text-sm text-muted-foreground">
                  {sections.length} Document {sections.length === 1 ? 'Section' : 'Sections'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-ai-glow" />
                <span className="text-sm text-muted-foreground">Global AI Assistant Active</span>
              </div>
              {activeSection && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-ai-glow rounded-full animate-pulse"></div>
                  <span className="text-sm text-ai-glow">Discussing: {activeSection.title}</span>
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              AI can analyze and compare all sections
            </div>
          </div>
        </Card>

        {sections.length === 0 ? (
          <Card className="p-12 text-center bg-ai-surface border-border border-dashed">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Document Sections</h3>
            <p className="text-muted-foreground mb-4">Add your first document section to get started</p>
            <Button onClick={addNewSection} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Add First Section
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
            {/* Document Sections */}
            <div className="lg:col-span-2 space-y-4 overflow-y-auto pr-2">
              {sections.map((section, index) => (
                <DocumentWindow
                  key={section.id}
                  section={section}
                  onClose={sections.length > 1 ? () => removeSection(section.id) : undefined}
                  onDiscuss={handleDiscussSection}
                  isActive={activeSection?.id === section.id}
                  className={`transition-all duration-500 ease-out animate-fade-in`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                />
              ))}
            </div>

            {/* Global Chat */}
            <div className="lg:col-span-1">
              <GlobalChat
                sections={sections}
                activeSection={activeSection}
                onSectionReference={(sectionId) => {
                  const section = sections.find(s => s.id === sectionId);
                  if (section) setActiveSection(section);
                }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Powered by AI • Global assistant can discuss and compare all document sections
          </p>
        </div>
      </div>
    </div>
  );
};