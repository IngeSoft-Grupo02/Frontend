'use client';

import { MOCK_AUDIT, MOCK_CATEGORIES, MOCK_STORES, MOCK_USERS } from '@/lib/mockData';
import { createContext, ReactNode, useContext, useState } from 'react';

// Define los tipos
interface Store {
  id: string;
  name: string;
  responsible: string;
  status: string;
  registrationDate: string;
  styles?: string[];
  prendas?: string[];
  clientes?: string[];
  palette?: string;
}

interface User {
  name: string;
  email: string;
  role: string;
  store: string;
  docType?: string;
  docNumber?: string;
  phone?: string;
  birthDate?: string;
  ruc?: string;
}

interface Category {
  name: string;
  description: string;
  status: string;
  use: number;
}

interface AuditLog {
  time: string;
  user: string;
  role: string;
  tenant: string;
  action: string;
  level: string;
}

interface AppContextType {
  isLoggedIn: boolean;
  currentUser: any;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  stores: Store[];
  users: User[];
  categories: Category[];
  auditLogs: AuditLog[];
  addStore: (store: any) => void;
  updateStore: (id: string, updates: any) => void;
  addUser: (user: any) => void;
  updateUser: (email: string, updates: any) => void;
  deleteUser: (email: string) => void;
  addCategory: (category: any) => void;
  updateCategory: (name: string, updates: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stores, setStores] = useState<Store[]>(MOCK_STORES);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [auditLogs] = useState<AuditLog[]>(MOCK_AUDIT);

  const login = (email: string, password: string) => {
    if (email === 'admin@platform.com' && password === 'admin123') {
      setIsLoggedIn(true);
      setCurrentUser({
        name: 'Admin Kingstore',
        email: 'admin@plataforma.com',
        phone: '987654321',
        role: 'Super admin'
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const addStore = (store: any) => {
    setStores((prev: Store[]) => [...prev, { 
      ...store, 
      id: `tenant-00${prev.length + 1}`,
      registrationDate: new Date().toLocaleDateString('es-PE')
    }]);
  };

  const updateStore = (id: string, updates: any) => {
    setStores((prev: Store[]) => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addUser = (user: any) => {
    setUsers((prev: User[]) => [...prev, user]);
  };

  const updateUser = (email: string, updates: any) => {
    setUsers((prev: User[]) => prev.map(u => u.email === email ? { ...u, ...updates } : u));
  };

  const deleteUser = (email: string) => {
    setUsers((prev: User[]) => prev.filter(u => u.email !== email));
  };

  const addCategory = (category: any) => {
    setCategories((prev: Category[]) => [...prev, { ...category, use: 0 }]);
  };

  const updateCategory = (name: string, updates: any) => {
    setCategories((prev: Category[]) => prev.map(c => c.name === name ? { ...c, ...updates } : c));
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      currentUser,
      login,
      logout,
      stores,
      users,
      categories,
      auditLogs,
      addStore,
      updateStore,
      addUser,
      updateUser,
      deleteUser,
      addCategory,
      updateCategory
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