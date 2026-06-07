'use client';

import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { View } from '../../types';
import App from '../../App';

export default function TiendasPage() {
  const { setCurrentView } = useApp();

  useEffect(() => {
    setCurrentView(View.DIRECTORY);
  }, [setCurrentView]);

  return <App />;
}
