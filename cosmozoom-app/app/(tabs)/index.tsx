import React, { useState, useEffect } from 'react';
import LoadingScreen from './login';
import InstallScreen from './install';

export default function AppEntryScreen() {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return showLoading ? <LoadingScreen /> : <InstallScreen />;
}