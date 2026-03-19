import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.Rabbitnutry.buddy',
  appName: 'Rabbit',
  webDir: 'dist',
  
  // ✅ CONFIGURAÇÕES CRÍTICAS PARA ANDROID 14
  android: {
    webViewDebuggingEnabled: true,
    allowMixedContent: false,
    allowFileAccess: true,
  },

  server: {
    androidScheme: 'https'
  }
};

export default config;
