// src/shared/ui/Icon/Icon.tsx

import { type SVGProps, forwardRef } from 'react';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/shared/ui/ThemeToggle';

export type IconName =
  | 'telegram'
  | 'spinner'
  | 'alert'
  | 'close'
  | 'arrow-right'
  | 'check'
  | 'menu'
  | 'settings';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 'md', className, ...props }, ref) => {
    const { actualTheme } = useTheme();
    const isDark = actualTheme === 'night';
    
    const sizeClasses = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
    };

    const iconColor = isDark 
      ? 'var(--tg-theme-button-text-color)'
      : 'var(--tg-theme-button-color)';

    const icons: Record<IconName, JSX.Element> = {
      telegram: (
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394a.677.677 0 0 1-.57.269l.213-3.05 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.962-.924c-.643-.204-.656-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.941z"/>
        </svg>
      ),
      spinner: (
        <svg fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.2"/>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      ),
      alert: (
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s6.48 10 10 10 10-6.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      ),
      close: (
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      ),
      'arrow-right': (
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
        </svg>
      ),
      check: (
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      ),
      menu: (
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      ),
      settings: (
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
        </svg>
      )
    };

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={cn(
          'inline-block select-none fill-current',
          sizeClasses[size],
          className
        )}
        style={{ color: iconColor }}
        {...props}
      >
        {icons[name]}
      </svg>
    );
  }
);

Icon.displayName = 'Icon';
