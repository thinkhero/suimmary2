'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  History, 
  Crown, 
  LogOut,
  ChevronDown 
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface UserMenuProps {
  user: User;
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const quotaUsed = 12;
  const dailyLimit = 50;
  const isPremium = false;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 rounded-xl">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-primary text-white text-sm">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">
              {quotaUsed}/{dailyLimit} used
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 rounded-2xl shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-gradient-primary text-white">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <div className="font-semibold text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
              <div className="flex items-center gap-2 mt-1">
                {isPremium ? (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Free Account
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-2">
          <DropdownMenuItem className="rounded-xl p-3 cursor-pointer">
            <User className="w-4 h-4 mr-3 text-gray-500" />
            <div>
              <div className="font-medium">Profile Settings</div>
              <div className="text-xs text-gray-500">Manage your account</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className="rounded-xl p-3 cursor-pointer">
            <History className="w-4 h-4 mr-3 text-gray-500" />
            <div>
              <div className="font-medium">Summary History</div>
              <div className="text-xs text-gray-500">View past summaries</div>
            </div>
          </DropdownMenuItem>

          {!isPremium && (
            <DropdownMenuItem className="rounded-xl p-3 cursor-pointer bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
              <Crown className="w-4 h-4 mr-3 text-yellow-600" />
              <div>
                <div className="font-medium text-yellow-900">Upgrade to Premium</div>
                <div className="text-xs text-yellow-700">Unlimited summaries</div>
              </div>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="rounded-xl p-3 cursor-pointer">
            <Settings className="w-4 h-4 mr-3 text-gray-500" />
            <div>
              <div className="font-medium">Settings</div>
              <div className="text-xs text-gray-500">Preferences & API</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem 
            onClick={onLogout}
            className="rounded-xl p-3 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-3" />
            <div className="font-medium">Sign Out</div>
          </DropdownMenuItem>
        </div>

        {!isPremium && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="text-xs text-gray-600 mb-2">Daily Usage</div>
            <div className="flex items-center gap-2">
              <div className="flex-grow bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(quotaUsed / dailyLimit) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-600">{quotaUsed}/{dailyLimit}</span>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}