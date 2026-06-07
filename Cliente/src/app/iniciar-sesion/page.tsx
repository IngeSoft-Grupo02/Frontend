'use client';

import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { View } from '../../types';
import App from '../../App';

export default function IniciarSesionPage() {
  const { setCurrentView } = useApp();

  useEffect(() => {
    setCurrentView(View.AUTH_LOGIN);
  }, [setCurrentView]);

  return <App />;
}
