'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [quotaUsed, setQuotaUsed] = useState(0);
  const dailyLimit = user ? 50 : 3; // 50 for logged in, 3 for anonymous

  useEffect(() => {
    // Check for saved auth state
    const savedUser = localStorage.getItem('user');
    const savedQuota = localStorage.getItem('quotaUsed');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedQuota) {
      setQuotaUsed(parseInt(savedQuota, 10));
    }
    
    // Reset quota daily (check last reset date)
    const lastReset = localStorage.getItem('lastQuotaReset');
    const today = new Date().toDateString();
    
    if (lastReset !== today) {
      setQuotaUsed(0);
      localStorage.setItem('lastQuotaReset', today);
      localStorage.setItem('quotaUsed', '0');
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Keep quota for anonymous usage
  };

  const incrementQuota = () => {
    const newQuota = quotaUsed + 1;
    setQuotaUsed(newQuota);
    localStorage.setItem('quotaUsed', newQuota.toString());
  };

  return {
    user,
    quotaUsed,
    dailyLimit,
    login,
    logout,
    incrementQuota
  };
}