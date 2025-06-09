'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Zap, FileText } from 'lucide-react';

interface ProgressSectionProps {
  taskId: string;
  inputType: string;
  onComplete: () => void;
}

interface ProcessingStep {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
  duration?: number;
}

export function ProgressSection({ taskId, inputType, onComplete }: ProgressSectionProps) {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<ProcessingStep[]>([]);

  useEffect(() => {
    // Initialize steps based on input type
    const getStepsForInputType = (type: string): ProcessingStep[] => {
      const baseSteps = [
        {
          id: 'upload',
          label: 'Processing Input',
          description: 'Analyzing and preparing your content',
          status: 'pending' as const,
          duration: 1000
        },
        {
          id: 'extract',
          label: 'Content Extraction',
          description: 'Extracting text and key information',
          status: 'pending' as const,
          duration: 2000
        },
        {
          id: 'analyze',
          label: 'AI Analysis',
          description: 'Understanding context and structure',
          status: 'pending' as const,
          duration: 3000
        },
        {
          id: 'summarize',
          label: 'Generating Summaries',
          description: 'Creating multiple summary formats',
          status: 'pending' as const,
          duration: 2000
        }
      ];

      if (type === 'video') {
        baseSteps.splice(1, 0, {
          id: 'transcribe',
          label: 'Transcription',
          description: 'Converting audio to text using Whisper AI',
          status: 'pending' as const,
          duration: 4000
        });
      }

      return baseSteps;
    };

    const initialSteps = getStepsForInputType(inputType);
    setSteps(initialSteps);

    // Start processing simulation
    let totalTime = 0;
    const totalSteps = initialSteps.length;

    initialSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStepIndex(index);
        setSteps(prev => prev.map((s, i) => ({
          ...s,
          status: i === index ? 'processing' : i < index ? 'completed' : 'pending'
        })));
        
        const progressValue = ((index + 1) / totalSteps) * 100;
        setProgress(progressValue);
        
        if (index === totalSteps - 1) {
          setTimeout(() => {
            setSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
            setTimeout(onComplete, 500);
          }, step.duration);
        }
      }, totalTime);
      
      totalTime += step.duration;
    });
  }, [inputType, onComplete]);

  const getStepIcon = (step: ProcessingStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Zap className="w-5 h-5 text-blue-500 animate-pulse" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepBadge = (step: ProcessingStep) => {
    switch (step.status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Processing</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-500">Pending</Badge>;
    }
  };

  return (
    <section className="min-h-screen py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FileText className="w-4 h-4" />
            Task ID: {taskId}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Processing Your Content
          </h1>
          <p className="text-lg text-gray-600">
            Our AI is analyzing your content and generating intelligent summaries
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-white/40 shadow-2xl p-8">
          {/* Overall Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
              <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 rounded-full" />
          </div>

          {/* Step Details */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 ${
                  step.status === 'processing' 
                    ? 'bg-blue-50 border border-blue-200' 
                    : step.status === 'completed'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getStepIcon(step)}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{step.label}</h4>
                    {getStepBadge(step)}
                  </div>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                  
                  {step.status === 'processing' && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Processing Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{steps.filter(s => s.status === 'completed').length}</div>
              <div className="text-sm text-gray-600">Steps Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.max(0, Math.round((Date.now() % 10000) / 1000))}s
              </div>
              <div className="text-sm text-gray-600">Elapsed Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {inputType === 'video' ? '~12s' : '~8s'}
              </div>
              <div className="text-sm text-gray-600">Estimated Total</div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}