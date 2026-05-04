'use client';

import { useState } from 'react';
import { CategoriasScreen } from '@/components/admin/CategoriasScreen';
import { MOCK_CATEGORIES, MOCK_STORES } from '@/mockData';

export default function CategoriasPage() {
  const [categories, setCategories] = useState(MOCK_CATEGORIES);

  const handleCreateCategory = (newCategory: any) => {
    setCategories(prev => [...prev, { ...newCategory, id: `cat-${prev.length + 1}` }]);
  };

  const handleUpdateCategory = (id: string, updates: any) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <CategoriasScreen
      categories={categories}
      stores={MOCK_STORES}
      onCreate={handleCreateCategory}
      onUpdate={handleUpdateCategory}
      onDelete={handleDeleteCategory}
    />
  );
}