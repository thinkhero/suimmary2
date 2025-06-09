'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Download, 
  Share2, 
  RotateCcw,
  FileText,
  List,
  Clock,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface ResultsSectionProps {
  taskId: string;
  summary?: string;
  onStartOver: () => void;
}

export function ResultsSection({ taskId, summary, onStartOver }: ResultsSectionProps) {
  const [activeTab, setActiveTab] = useState('brief');

  const displaySummary = summary ||
    "This comprehensive article explores the transformative impact of artificial intelligence on modern business operations. The piece highlights how AI technologies are revolutionizing decision-making processes, enhancing customer experiences, and driving operational efficiency across various industries. Key benefits include predictive analytics for better forecasting, automated customer service through chatbots, and streamlined supply chain management. The article also addresses potential challenges such as workforce displacement concerns and the need for proper AI governance frameworks. Overall, businesses that strategically implement AI solutions while maintaining ethical considerations are positioned to gain significant competitive advantages in the digital economy.";

  return (
    <section className="min-h-screen py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <CheckCircle className="w-4 h-4" />
            Processing Complete
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your AI-Generated Summary
          </h1>
          <p className="text-lg text-gray-600">
            Choose your preferred format and export or share your results
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button
            onClick={() => navigator.clipboard.writeText(displaySummary)}
            variant="outline"
            className="rounded-xl"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          
          <Button
            onClick={() => {
              const blob = new Blob([displaySummary], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `summary-${taskId}.md`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              toast.success('Summary downloaded!');
            }}
            variant="outline"
            className="rounded-xl"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          
          <Button
            onClick={onStartOver}
            className="bg-gradient-primary hover:opacity-90 text-white rounded-xl"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Summary
          </Button>
        </div>

        {/* Results Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-white/40 shadow-2xl">
          <div className="p-6">
            <div className="prose prose-blue max-w-none text-lg">
              <ReactMarkdown>
                {displaySummary}
              </ReactMarkdown>
            </div>
          </div>
        </Card>

        {/* Additional Actions */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/40">
            <span className="text-sm text-gray-600">Want to process more content?</span>
            <Button
              onClick={onStartOver}
              variant="outline"
              size="sm"
              className="rounded-xl"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Start New Summary
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}