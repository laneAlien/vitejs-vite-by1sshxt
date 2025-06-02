// src/shared/ui/Input/Input.tsx

import { 
  forwardRef,
  useState,
  useEffect,
  type InputHTMLAttributes
} from 'react';
import { 
  motion, 
  AnimatePresence,
  type Variants 
} from 'framer-motion';
import { Icon } from '@/shared/ui/Icon';
import { Loader } from '@/shared/ui/Loader';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/shared/ui/ThemeToggle';
import styles from './Input.module.css';

export type InputVariant = 
  | 'primary'
  | 'outline'
  | 'ghost';

export type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  animated?: boolean;
}

const errorVariants: Variants = {
  hidden: { opacity: 0, y: -5 },
  visible: { opacity: 1, y: 0 }
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    variant = 'primary',
    size = 'md',
    className,
    label,
    error,
    success,
    loading = false,
    iconLeft,
    iconRight,
    fullWidth = false,
    animated = true,
    onFocus,
    onBlur,
    ...props
  }, ref) => {
    const { actualTheme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const isDark = actualTheme === 'night';

    const sizeClasses = {
      sm: 'h-8 px-2 text-sm',
      md: 'h-10 px-3 text-base',
      lg: 'h-12 px-4 text-lg',
    };

    const variantClasses = {
      primary: cn(
        'bg-tg-theme-bg-color border-tg-theme-secondary-bg-color',
        'hover:border-tg-theme-link-color focus:border-tg-theme-link-color',
        'disabled:opacity-50 disabled:pointer-events-none'
      ),
      outline: cn(
        'border-2 bg-transparent',
        isDark 
          ? 'border-tg-theme-hint-color hover:border-tg-theme-link-color'
          : 'border-tg-theme-button-color hover:border-tg-theme-link-color'
      ),
      ghost: 'bg-transparent border-transparent hover:bg-tg-theme-secondary-bg-color'
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setIsTouched(true);
      onBlur?.(e);
    };

    return (
      <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label 
            className={cn(
              'text-sm font-medium',
              error ? 'text-red-500' : 'text-tg-theme-text-color'
            )}
          >
            {label}
          </label>
        )}

        <motion.div
          className={cn(
            styles.inputContainer,
            variantClasses[variant],
            sizeClasses[size],
            fullWidth && 'w-full',
            error && 'border-red-500',
            success && 'border-green-500',
            className
          )}
          initial={false}
          animate={{
            borderColor: error 
              ? 'var(--tg-error-color)'
              : success
              ? 'var(--tg-success-color)'
              : isFocused
              ? 'var(--tg-theme-link-color)'
              : variant === 'primary'
              ? 'var(--tg-theme-secondary-bg-color)'
              : 'currentColor'
          }}
          transition={animated ? { duration: 0.2 } : undefined}
        >
          {iconLeft && (
            <span className="mr-2 flex items-center">
              {loading ? <Loader size="sm" /> : iconLeft}
            </span>
          )}

          <input
            ref={ref}
            className={cn(
              'w-full bg-transparent outline-none placeholder:text-tg-theme-hint-color',
              iconLeft && 'pl-2',
              iconRight && 'pr-2'
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={!!error}
            {...props}
          />

          <span className="ml-2 flex items-center gap-1">
            {loading && !iconRight && <Loader size="sm" />}
            {success && <Icon name="check" className="text-green-500" />}
            {iconRight}
          </span>
        </motion.div>

        <AnimatePresence>
          {(error && isTouched) && (
            <motion.div
              className="flex items-center gap-1 text-red-500 text-sm"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <Icon name="alert" size="sm" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';
