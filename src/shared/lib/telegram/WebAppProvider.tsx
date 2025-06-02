// src/shared/lib/telegram/WebAppProvider.tsx

import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode
} from 'react';
import { useTheme } from '@/shared/ui/ThemeToggle';

declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

interface WebAppContextType {
  initData: Record<string, string>;
  userId: string | null;
  themeParams: TelegramThemeParams;
  showAlert: (message: string) => Promise<void>;
  showConfirm: (message: string) => Promise<boolean>;
  requestContact: () => Promise<string>;
  closeWebApp: () => void;
  isExpanded: boolean;
  headerColor: string;
  setHeaderColor: (color: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
}

interface TelegramThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
}

const WebAppContext = createContext<WebAppContextType>({} as WebAppContextType);

export function WebAppProvider({ children }: { children: ReactNode }) {
  const { setTheme } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [themeParams, setThemeParams] = useState<TelegramThemeParams>({});
  const [headerColor, setHeaderColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  useEffect(() => {
    if (typeof window.Telegram?.WebApp !== 'undefined') {
      const webApp = window.Telegram.WebApp;
      webApp.ready();
      setIsReady(true);

      // Инициализация параметров темы
      const params = webApp.themeParams || {};
      setThemeParams(params);
      setHeaderColor(params.bg_color || '#ffffff');
      setBackgroundColor(params.secondary_bg_color || '#ffffff');

      // Синхронизация с темой приложения
      setTheme(params.bg_color?.includes('night') ? 'night' : 'day');

      // Обработчик изменений темы
      webApp.onEvent('themeChanged', () => {
        setThemeParams(webApp.themeParams);
      });
    }
  }, []);

  const value: WebAppContextType = {
    initData: parseInitData(window.Telegram?.WebApp?.initData || ''),
    userId: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
    themeParams,
    showAlert: (message) => 
      new Promise((resolve) => window.Telegram?.WebApp.showAlert(message, resolve)),
    showConfirm: (message) => 
      new Promise((resolve) => window.Telegram?.WebApp.showConfirm(message, resolve)),
    requestContact: () => 
      new Promise((resolve) => {
        window.Telegram.WebApp.openContactForm((data: any) => 
          resolve(data?.phone_number)
        );
      }),
    closeWebApp: () => window.Telegram?.WebApp.close(),
    isExpanded: window.Telegram?.WebApp.isExpanded,
    headerColor,
    setHeaderColor: (color) => {
      window.Telegram?.WebApp.setHeaderColor(color);
      setHeaderColor(color);
    },
    backgroundColor,
    setBackgroundColor: (color) => {
      window.Telegram?.WebApp.setBackgroundColor(color);
      setBackgroundColor(color);
    }
  };

  if (!isReady) return null;

  return (
    <WebAppContext.Provider value={value}>
      <div 
        style={{ backgroundColor: themeParams.bg_color }}
        className="min-h-screen transition-colors"
      >
        {children}
      </div>
    </WebAppContext.Provider>
  );
}

export const useWebApp = () => useContext(WebAppContext);

function parseInitData(initData: string): Record<string, string> {
  return Object.fromEntries(
    new URLSearchParams(initData).entries()
  );
}
