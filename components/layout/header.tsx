'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Menu, User, LogOut } from 'lucide-react';
import { AuthModal } from '@/components/auth/auth-modal';
import { UserMenu } from '@/components/auth/user-menu';
import { useAuth } from '@/hooks/use-auth';

export function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="relative z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-primary p-2 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SummaryAI</h1>
              <p className="text-xs text-gray-500">Intelligent Summarization</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </a>
            <a href="#api" className="text-gray-600 hover:text-gray-900 transition-colors">
              API
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <UserMenu user={user} onLogout={logout} />
            ) : (
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-primary hover:opacity-90 text-white"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
            
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </header>
  );
}