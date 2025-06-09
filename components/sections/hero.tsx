import { Button } from '@/components/ui/button';
import { ArrowDown, Zap, Globe, Shield } from 'lucide-react';

export function Hero() {
  const scrollToInput = () => {
    document.getElementById('input-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Any Content Into
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {' '}Actionable Summaries
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Powered by advanced AI, our platform converts articles, videos, PDFs, and web pages 
            into concise, intelligent summaries in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              onClick={scrollToInput}
              size="lg"
              className="bg-gradient-primary hover:opacity-90 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Summarizing
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-lg border-2 border-gray-200 hover:border-blue-300 rounded-2xl transition-all duration-300"
            >
              Watch Demo
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/40 hover:bg-white/80 transition-all duration-300">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Process any content in under 8 seconds with our optimized AI pipeline</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/40 hover:bg-white/80 transition-all duration-300">
              <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Language</h3>
              <p className="text-gray-600">Automatic language detection with support for 50+ languages</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/40 hover:bg-white/80 transition-all duration-300">
              <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-gray-600">Your content is never stored and automatically deleted after processing</p>
            </div>
          </div>
        </div>

        <div className="mt-16 animate-bounce">
          <Button
            variant="ghost"
            onClick={scrollToInput}
            className="rounded-full p-3 hover:bg-white/20"
          >
            <ArrowDown className="w-6 h-6 text-gray-600" />
          </Button>
        </div>
      </div>
    </section>
  );
}