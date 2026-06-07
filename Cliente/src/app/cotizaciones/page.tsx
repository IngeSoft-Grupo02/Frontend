'use client';

import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { View } from '../../types';
import App from '../../App';

export default function CotizacionesPage() {
  const { setCurrentView } = useApp();

  useEffect(() => {
    setCurrentView(View.MY_QUOTES);
  }, [setCurrentView]);

  return <App />;
}
