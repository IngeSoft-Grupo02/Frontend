'use client';

import { useEffect } from 'react';
import App from './App';
import { useApp } from './context/AppContext';
import { View } from './types';

export function ClienteRouteView({ view }: { view: View }) {
  const { setCurrentView } = useApp();

  useEffect(() => {
    setCurrentView(view);
  }, [setCurrentView, view]);

  return <App />;
}
