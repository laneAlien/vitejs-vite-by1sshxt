// src/shared/ui/Loader/Loader.tsx

import { cn } from '@/shared/lib/utils';
import { motion, type Variants } from 'framer-motion';
import { useTheme } from '../ThemeToggle';

export type LoaderType = 'bubbles' | 'circle' | 'progress';

interface LoaderProps {
  type?: LoaderType;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

const bubbleVariants: Variants = {
  initial: { y: 0 },
  animate: (index: number) => ({
    y: [0, -15, 0],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      delay: index * 0.2,
    }
  })
};

export const Loader = ({
  type = 'bubbles',
  size = 'md',
  fullScreen = false,
  className
}: LoaderProps) => {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'night';

  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const renderLoader = () => {
    switch (type) {
      case 'bubbles':
        return (
          <div className="flex items-center justify-center space-x-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                custom={index}
                variants={bubbleVariants}
                initial="initial"
                animate="animate"
                className={cn(
                  'rounded-full',
                  sizes[size],
                  isDark ? 'bg-tg-button-text-color' : 'bg-tg-button-color'
                )}
              />
            ))}
          </div>
        );
      
      case 'circle':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            className={cn(
              'border-2 rounded-full',
              sizes[size],
              'border-t-transparent',
              isDark 
                ? 'border-r-tg-hint-color border-b-tg-link-color border-l-tg-button-color'
                : 'border-r-tg-button-color border-b-tg-link-color border-l-tg-hint-color'
            )}
          />
        );

      case 'progress':
        return (
          <div className={cn(
            'overflow-hidden rounded-full bg-tg-secondary-bg-color',
            sizes[size]
          )}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ 
                repeat: Infinity,
                duration: 2,
                ease: 'easeInOut'
              }}
              className={cn(
                'h-full',
                isDark ? 'bg-tg-button-text-color' : 'bg-tg-button-color'
              )}
            />
          </div>
        );
    }
  };

  return (
    <div className={cn(
      'flex items-center justify-center',
      fullScreen ? 'min-h-screen w-full' : '',
      className
    )}>
      {renderLoader()}
    </div>
  );
};
