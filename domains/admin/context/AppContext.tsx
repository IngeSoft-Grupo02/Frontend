'use client';

import { api, clearAdminSessionStorage, isTokenExpired } from '@/domains/admin/lib/api';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface AdminSessionUser {
  id?: number;
  name: string;
  email: string;
  role: string;
}

function toAdminSessionUser(user: { id?: number; firstName?: string | null; paternalSurname?: string | null; email: string; role: string }): AdminSessionUser {
  const name = `${user.firstName ?? ''} ${user.paternalSurname ?? ''}`.trim();
  return {
    id: user.id,
    name: name || user.email,
    email: user.email,
    role: user.role,
  };
}

interface AppContextType {
  isLoggedIn: boolean;
  isAuthInitialized: boolean;
  currentUser: AdminSessionUser | null;
  login: (userData: AdminSessionUser) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminSessionUser | null>(null);

  useEffect(() => {
    const hydrateSession = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('adminUser');
        if (token && storedUser && !isTokenExpired(token)) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser?.role === 'SYSTEM_ADMIN' && parsedUser?.id) {
            const userFromDb = await api.users.getById(parsedUser.id);
            if (userFromDb.role === 'SYSTEM_ADMIN') {
              const sessionUser = toAdminSessionUser(userFromDb);
              localStorage.setItem('adminUser', JSON.stringify(sessionUser));
              setCurrentUser(sessionUser);
              setIsLoggedIn(true);
            } else {
              clearAdminSessionStorage();
            }
          } else {
            clearAdminSessionStorage();
          }
        } else {
          clearAdminSessionStorage();
        }
      } catch {
        clearAdminSessionStorage();
      } finally {
        setIsAuthInitialized(true);
      }
    };

    hydrateSession();
  }, []);

  useEffect(() => {
    const onSessionExpired = () => {
      setIsLoggedIn(false);
      setCurrentUser(null);
    };
    window.addEventListener('admin:session-expired', onSessionExpired);
    return () => window.removeEventListener('admin:session-expired', onSessionExpired);
  }, []);

  const login = (userData: AdminSessionUser) => {
    if (userData.role !== 'SYSTEM_ADMIN') return false;
    setIsLoggedIn(true);
    setCurrentUser(userData);
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    clearAdminSessionStorage();
  };

  return (
      <AppContext.Provider value={{
        isLoggedIn,
        isAuthInitialized,
        currentUser,
        login,
        logout
      }}>
        {children}
      </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
