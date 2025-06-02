// src/shared/lib/hooks/useTelegramBackHandler.ts
import { useEffect } from 'react';
import { useWebApp } from '@twa-dev/sdk-react';

export const useTelegramBackHandler = (onBack: () => void) => {
  const webApp = useWebApp();

  useEffect(() => {
    const handler = () => {
      onBack();
      return false;
    };

    webApp.BackButton.onClick(handler);
    return () => {
      webApp.BackButton.offClick(handler);
    };
  }, [onBack, webApp]);
};
