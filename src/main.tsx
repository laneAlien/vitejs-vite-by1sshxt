// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from '@/shared/ui/ThemeToggle/ThemeContext';
import { TelemetryProvider } from '@/shared/lib/telemetry';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { Loader } from '@/shared/ui/Loader';
import './index.css';

// Lazy load App for code splitting — App itself no longer wraps a Router
const LazyApp = React.lazy(() => import('./App'));

// Telegram-like spring animation config
const tgAnimationConfig = {
  stiffness: 350,
  damping: 35,
  mass: 0.5,
  restDelta: 0.001,
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <React.Suspense fallback={<Loader fullScreen type="bubbles" />}>
        <Router>
          <ThemeProvider
            initialTheme="system"
            storageKey="library-theme"
            themes={['day', 'night', 'system']}
          >
            <TelemetryProvider
              enabled={import.meta.env.PROD}
              endpoint="/api/telemetry"
            >
              <MotionConfig
                transition={{
                  type: "spring",
                  ...tgAnimationConfig,
                }}
              >
                <LazyApp />
              </MotionConfig>
            </TelemetryProvider>
          </ThemeProvider>
        </Router>
      </React.Suspense>
    </ErrorBoundary>
  </React.StrictMode>
);
