'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Hero } from '@/components/sections/hero';
import { InputSection } from '@/components/sections/input-section';
import { ProgressSection } from '@/components/sections/progress-section';
import { ResultsSection } from '@/components/sections/results-section';
import { Footer } from '@/components/layout/footer';

export type ProcessingStep = 'input' | 'processing' | 'completed';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<ProcessingStep>('input');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [inputType, setInputType] = useState<string>('');

  const handleProcessingStart = (type: string, id: string) => {
    setInputType(type);
    setTaskId(id);
    setCurrentStep('processing');
  };

  const handleProcessingComplete = () => {
    setCurrentStep('completed');
  };

  const handleStartOver = () => {
    setCurrentStep('input');
    setTaskId(null);
    setInputType('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="relative">
        {currentStep === 'input' && (
          <>
            <Hero />
            <InputSection onProcessingStart={handleProcessingStart} />
          </>
        )}
        
        {currentStep === 'processing' && taskId && (
          <ProgressSection 
            taskId={taskId}
            inputType={inputType}
            onComplete={handleProcessingComplete}
          />
        )}
        
        {currentStep === 'completed' && taskId && (
          <ResultsSection 
            taskId={taskId}
            onStartOver={handleStartOver}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}