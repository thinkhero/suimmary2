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

interface ResultsSectionProps {
  taskId: string;
  onStartOver: () => void;
}

export function ResultsSection({ taskId, onStartOver }: ResultsSectionProps) {
  const [activeTab, setActiveTab] = useState('brief');

  // Mock summary data - in production this would come from your API
  const summaryData = {
    brief: {
      title: "Brief Summary",
      content: "This comprehensive article explores the transformative impact of artificial intelligence on modern business operations. The piece highlights how AI technologies are revolutionizing decision-making processes, enhancing customer experiences, and driving operational efficiency across various industries. Key benefits include predictive analytics for better forecasting, automated customer service through chatbots, and streamlined supply chain management. The article also addresses potential challenges such as workforce displacement concerns and the need for proper AI governance frameworks. Overall, businesses that strategically implement AI solutions while maintaining ethical considerations are positioned to gain significant competitive advantages in the digital economy.",
      wordCount: 98,
      language: "English"
    },
    points: {
      title: "Key Points",
      items: [
        "AI is transforming business decision-making through predictive analytics and data-driven insights",
        "Customer experience is enhanced via AI-powered chatbots and personalized recommendations",
        "Operational efficiency improves through automated processes and supply chain optimization",
        "Workforce displacement remains a concern requiring strategic workforce planning",
        "Ethical AI governance frameworks are essential for responsible implementation",
        "Strategic AI adoption provides significant competitive advantages in digital markets"
      ],
      language: "English"
    },
    timeline: {
      title: "Timeline Summary",
      segments: [
        {
          timestamp: "0:00 - 2:30",
          title: "Introduction to AI in Business",
          description: "Overview of artificial intelligence applications in modern enterprises"
        },
        {
          timestamp: "2:30 - 5:45",
          title: "Decision-Making Revolution",
          description: "How predictive analytics and AI are changing business strategies"
        },
        {
          timestamp: "5:45 - 8:20",
          title: "Customer Experience Enhancement",
          description: "AI-powered chatbots and personalization driving customer satisfaction"
        },
        {
          timestamp: "8:20 - 11:10",
          title: "Operational Efficiency Gains",
          description: "Automation and supply chain optimization through AI technologies"
        },
        {
          timestamp: "11:10 - 13:30",
          title: "Challenges and Considerations",
          description: "Addressing workforce concerns and implementing ethical AI practices"
        },
        {
          timestamp: "13:30 - 15:00",
          title: "Future Competitive Advantages",
          description: "Strategic positioning for success in the AI-driven economy"
        }
      ],
      language: "English"
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Content copied to clipboard!');
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Summary downloaded!');
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/shared/${taskId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Summary',
          text: 'Check out this AI-generated summary',
          url: shareUrl,
        });
      } catch (error) {
        handleCopy(shareUrl);
      }
    } else {
      handleCopy(shareUrl);
      toast.success('Share link copied to clipboard!');
    }
  };

  const formatTimelineContent = (segments: any[]) => {
    return segments.map(seg => 
      `**${seg.timestamp}** - ${seg.title}\n${seg.description}`
    ).join('\n\n');
  };

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
            onClick={() => handleCopy(
              activeTab === 'brief' ? summaryData.brief.content :
              activeTab === 'points' ? summaryData.points.items.join('\n') :
              formatTimelineContent(summaryData.timeline.segments)
            )}
            variant="outline"
            className="rounded-xl"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          
          <Button
            onClick={() => handleDownload(
              activeTab === 'brief' ? summaryData.brief.content :
              activeTab === 'points' ? summaryData.points.items.join('\n') :
              formatTimelineContent(summaryData.timeline.segments),
              `summary-${activeTab}-${taskId}.md`
            )}
            variant="outline"
            className="rounded-xl"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          
          <Button
            onClick={handleShare}
            variant="outline"
            className="rounded-xl"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-50/80 rounded-2xl p-1 mb-6">
              <TabsTrigger 
                value="brief" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Brief
              </TabsTrigger>
              <TabsTrigger 
                value="points" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <List className="w-4 h-4 mr-2" />
                Key Points
              </TabsTrigger>
              <TabsTrigger 
                value="timeline" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Clock className="w-4 h-4 mr-2" />
                Timeline
              </TabsTrigger>
            </TabsList>

            <TabsContent value="brief" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">{summaryData.brief.title}</h3>
                  <div className="flex gap-2">
                    <Badge variant="outline">{summaryData.brief.language}</Badge>
                    <Badge variant="outline">{summaryData.brief.wordCount} words</Badge>
                  </div>
                </div>
                <div className="prose prose-gray max-w-none">
                  <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-blue-500">
                    <p className="text-gray-700 leading-relaxed text-lg mb-0">
                      {summaryData.brief.content}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="points" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">{summaryData.points.title}</h3>
                  <div className="flex gap-2">
                    <Badge variant="outline">{summaryData.points.language}</Badge>
                    <Badge variant="outline">{summaryData.points.items.length} points</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  {summaryData.points.items.map((point, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">{summaryData.timeline.title}</h3>
                  <div className="flex gap-2">
                    <Badge variant="outline">{summaryData.timeline.language}</Badge>
                    <Badge variant="outline">{summaryData.timeline.segments.length} segments</Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  {summaryData.timeline.segments.map((segment, index) => (
                    <div key={index} className="relative pl-8">
                      <div className="absolute left-0 top-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                      {index < summaryData.timeline.segments.length - 1 && (
                        <div className="absolute left-1.5 top-5 w-0.5 h-full bg-gray-200"></div>
                      )}
                      <div className="bg-gray-50 p-4 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {segment.timestamp}
                          </Badge>
                          <h4 className="font-semibold text-gray-900">{segment.title}</h4>
                        </div>
                        <p className="text-gray-600">{segment.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
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