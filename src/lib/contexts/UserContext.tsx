"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserSession, UserData } from '@/lib/utils/auth';
import { useRouter } from 'next/navigation';

interface UserContextType {
  user: UserData | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  updateUser: (updatedUser: UserData) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const session = await getUserSession();
      if (session.isLoggedIn && session.user) {
        setUser(session.user);
      } else {
        setUser(null);
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching user session:', error);
      setUser(null);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const updateUser = (updatedUser: UserData) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value: UserContextType = {
    user,
    isLoading,
    refreshUser,
    updateUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
