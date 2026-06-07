'use client';

import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { View } from '../../types';
import App from '../../App';

export default function RecuperacionPage() {
  const { setCurrentView } = useApp();

  useEffect(() => {
    setCurrentView(View.AUTH_FORGOT_PASSWORD);
  }, [setCurrentView]);

  return <App />;
}
