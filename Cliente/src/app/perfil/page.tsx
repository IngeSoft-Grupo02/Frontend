'use client';

import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { View } from '../../types';
import App from '../../App';

export default function PerfilPage() {
  const { setCurrentView } = useApp();

  useEffect(() => {
    setCurrentView(View.PROFILE);
  }, [setCurrentView]);

  return <App />;
}
