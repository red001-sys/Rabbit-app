import { Capacitor } from '@capacitor/core';
import React, { useEffect, useState } from 'react';
import { App } from '@capacitor/app';

const AppComponent = () => {
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Safe Capacitor initialization
      if (Capacitor.isNativePlatform()) {
        App.addListener('backButton', () => {
          // Handle back button logic
        });
      }
    } catch (err) {
      setError('Initialization Error');
      console.error(err);
    }

    // Accessing LocalStorage with try-catch
    try {
      const data = localStorage.getItem('someKey');
      // Process data
    } catch (err) {
      setError('LocalStorage Access Error');
      console.error(err);
    }
  }, []);

  if (error) {
    return <div>{error}</div>; // Fallback error UI
  }

  return <div>Your app content here</div>;
};

export default AppComponent;
