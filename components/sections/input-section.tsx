'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Link, 
  Upload, 
  Youtube, 
  Sparkles,
  Clock,
  User
} from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

interface InputSectionProps {
  onProcessingStart: (type: string, taskId: string) => void;
}

interface ApiResponse {
  summary?: string;
  taskId: string;
  status: 'processing' | 'completed' | 'error';
  message?: string;
  error?: string;
}

export function InputSection({ onProcessingStart }: InputSectionProps) {
  const [activeTab, setActiveTab] = useState('text');
  const [textContent, setTextContent] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, quotaUsed, dailyLimit } = useAuth();

  const handleSubmit = async (type: string, content: any) => {
    if (!user && quotaUsed >= 3) {
      toast.error('Daily limit reached. Please sign in for more quota.');
      return;
    }

    if (user && quotaUsed >= dailyLimit) {
      toast.error('Daily quota exceeded. Upgrade to Premium for unlimited access.');
      return;
    }

    if (!content) {
      toast.error('Please provide content to process');
      return;
    }

    setIsProcessing(true);
    
    try {
      // 准备请求数据
      const requestData: { type: string; content: string | File } = {
        type,
        content: content instanceof File ? await readFileAsText(content) : content
      };

      const response = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || data.status === 'error') {
        throw new Error(data.error || 'Failed to process content');
      }

      // 根据不同类型处理响应
      if (type === 'text' && data.status === 'completed') {
        toast.success('Summary generated successfully!');
      } else {
        toast.info(data.message || 'Processing started...');
      }

      onProcessingStart(type, data.taskId);
    } catch (error) {
      console.error('Processing error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process content');
    } finally {
      setIsProcessing(false);
    }
  };

  // 辅助函数：读取文件内容
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const remainingQuota = user ? dailyLimit - quotaUsed : 3 - quotaUsed;

  return (
    <section id="input-section" className="py-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Input Method
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Upload files, paste text, or provide URLs - we support all major content formats
          </p>
          
          {/* Quota Display */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/40">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {remainingQuota} summaries remaining today
            </span>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-white/40 shadow-2xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-50/80 rounded-2xl p-1">
              <TabsTrigger 
                value="text" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Text
              </TabsTrigger>
              <TabsTrigger 
                value="url" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Link className="w-4 h-4 mr-2" />
                URL
              </TabsTrigger>
              <TabsTrigger 
                value="file" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Files
              </TabsTrigger>
              <TabsTrigger 
                value="video" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Youtube className="w-4 h-4 mr-2" />
                Video
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="mt-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste your text content here... (articles, documents, research papers)"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="min-h-[200px] text-base border-gray-200 focus:border-blue-400 rounded-2xl"
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {textContent.length} characters
                  </p>
                  <Button
                    onClick={() => handleSubmit('text', textContent)}
                    disabled={!textContent.trim() || isProcessing}
                    className="bg-gradient-primary hover:opacity-90 text-white px-6 py-2 rounded-xl"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Summarize Text'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="url" className="mt-6">
              <div className="space-y-4">
                <Input
                  placeholder="https://example.com/article"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="text-base border-gray-200 focus:border-blue-400 rounded-2xl py-3"
                />
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-blue-700">
                    <strong>Supported:</strong> Articles, blog posts, news sites, documentation, and most web content
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSubmit('url', urlInput)}
                    disabled={!urlInput.trim() || isProcessing}
                    className="bg-gradient-primary hover:opacity-90 text-white px-6 py-2 rounded-xl"
                  >
                    <Link className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Extract & Summarize'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="file" className="mt-6">
              <FileUpload
                onFileSelect={(file) => handleSubmit('file', file)}
                isProcessing={isProcessing}
              />
            </TabsContent>

            <TabsContent value="video" className="mt-6">
              <div className="space-y-4">
                <Input
                  placeholder="YouTube URL or upload video file"
                  className="text-base border-gray-200 focus:border-blue-400 rounded-2xl py-3"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <Youtube className="w-5 h-5 text-red-600 mr-2" />
                      <span className="font-medium text-red-900">YouTube</span>
                    </div>
                    <p className="text-sm text-red-700">
                      Extract transcripts and create chapter-based summaries
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <Upload className="w-5 h-5 text-purple-600 mr-2" />
                      <span className="font-medium text-purple-900">Local Files</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      MP4, MOV, AVI files with automatic transcription
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    className="bg-gradient-primary hover:opacity-90 text-white px-6 py-2 rounded-xl"
                    disabled={isProcessing}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Process Video'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </section>
  );
}