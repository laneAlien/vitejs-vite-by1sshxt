// src/shared/ui/ErrorBoundary/index.tsx

import React, { 
  Component, 
  type ErrorInfo, 
  type ReactNode,
  useContext
} from 'react';
import { Button } from '@/shared/ui/Button';
import { Loader } from '@/shared/ui/Loader';
import { ThemeContext } from '@/shared/ui/ThemeToggle';
import { captureException } from '@/shared/lib/telemetry';
import { cn } from '@/shared/lib/utils';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  componentStack?: string;
  isLoading: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      isLoading: false
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error Boundary caught:', error, info);
    captureException(error, { componentStack: info.componentStack });
    this.setState({ componentStack: info.componentStack });
  }

  handleReset = async () => {
    this.setState({ isLoading: true });
    try {
      // Попытка восстановления состояния
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.setState({ 
        hasError: false,
        error: undefined,
        componentStack: undefined,
        isLoading: false
      });
    } catch (resetError) {
      console.error('Reset failed:', resetError);
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { theme, actualTheme } = useContext(ThemeContext);
    const { hasError, error, componentStack, isLoading } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      return fallback || (
        <div className={cn(
          styles.container,
          actualTheme === 'night' ? styles.dark : styles.light
        )}>
          <div className={styles.content}>
            <h1 className={styles.title}>⚠️ Critical Error</h1>
            
            <div className={styles.card}>
              <pre className={styles.error}>
                {error?.toString() || 'Unknown error'}
              </pre>
              
              {componentStack && (
                <details className={styles.details}>
                  <summary>Component Stack</summary>
                  <pre className={styles.stack}>
                    {componentStack}
                  </pre>
                </details>
              )}
            </div>

            <div className={styles.actions}>
              <Button
                variant="primary"
                onClick={this.handleReset}
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? 'Recovering...' : 'Try to Recover'}
              </Button>
              
              <Button
                variant="secondary"
                onClick={() => location.reload()}
              >
                Full Reload
              </Button>
            </div>
            
            {isLoading && (
              <div className={styles.loader}>
                <Loader type="progress" size="sm" />
              </div>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
}
