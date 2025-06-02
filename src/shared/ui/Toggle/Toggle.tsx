// src/shared/ui/Toggle/Toggle.tsx

import {
  forwardRef,
  useState,
  useEffect,
  type ReactNode,
  type HTMLAttributes
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/shared/ui/Icon';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/shared/ui/ThemeToggle';
import styles from './Toggle.module.css';

export type ToggleVariant = 
  | 'primary'
  | 'outline'
  | 'ghost'
  | 'neutral';

export type ToggleSize = 'sm' | 'md' | 'lg';

interface ToggleProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: ToggleVariant;
  size?: ToggleSize;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
  iconOn?: ReactNode;
  iconOff?: ReactNode;
  label?: string;
  labelPosition?: 'left' | 'right';
  showStatusText?: boolean;
  fullWidth?: boolean;
}

const thumbVariants = {
  off: { x: 2 },
  on: { x: '100%' }
};

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({
    variant = 'primary',
    size = 'md',
    checked: controlledChecked,
    defaultChecked = false,
    onChange,
    disabled = false,
    loading = false,
    iconOn = <Icon name="check" size="xs" />,
    iconOff = <Icon name="close" size="xs" />,
    label,
    labelPosition = 'right',
    showStatusText = false,
    fullWidth = false,
    className,
    ...props
  }, ref) => {
    const { actualTheme } = useTheme();
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const isControlled = typeof controlledChecked !== 'undefined';
    const checked = isControlled ? controlledChecked : internalChecked;
    const isDark = actualTheme === 'night';

    const sizeClasses = {
      sm: 'h-5 w-9 text-xs',
      md: 'h-6 w-11 text-sm',
      lg: 'h-7 w-14 text-base',
    };

    const variantClasses = {
      primary: cn(
        checked 
          ? 'bg-tg-theme-link-color' 
          : 'bg-tg-theme-secondary-bg-color',
        'hover:bg-opacity-80'
      ),
      outline: cn(
        'border-2 bg-transparent',
        checked
          ? 'border-tg-theme-link-color'
          : isDark 
            ? 'border-tg-theme-hint-color' 
            : 'border-tg-theme-secondary-bg-color'
      ),
      ghost: 'bg-transparent border-transparent hover:bg-tg-theme-secondary-bg-color',
      neutral: checked 
        ? 'bg-tg-theme-secondary-bg-color' 
        : 'bg-tg-theme-secondary-bg-color/30'
    };

    const handleToggle = () => {
      if (!disabled && !loading) {
        const newValue = !checked;
        if (!isControlled) setInternalChecked(newValue);
        onChange?.(newValue);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled || loading}
        className={cn(
          styles.toggleWrapper,
          fullWidth && 'w-full',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={handleToggle}
        {...props}
      >
        {label && labelPosition === 'left' && (
          <span className="mr-2 text-tg-theme-text-color">{label}</span>
        )}

        <div className={cn(
          styles.track,
          sizeClasses[size],
          variantClasses[variant],
          'relative rounded-full transition-all'
        )}>
          <motion.div
            className={styles.thumb}
            variants={thumbVariants}
            animate={checked ? 'on' : 'off'}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Loader size="xs" />
                </motion.div>
              ) : (
                <motion.div
                  key="icon"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={styles.icon}
                >
                  {checked ? iconOn : iconOff}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {showStatusText && (
          <span className={cn(
            'ml-2 text-sm',
            checked ? 'text-tg-theme-link-color' : 'text-tg-theme-hint-color'
          )}>
            {checked ? 'On' : 'Off'}
          </span>
        )}

        {label && labelPosition === 'right' && (
          <span className="ml-2 text-tg-theme-text-color">{label}</span>
        )}
      </button>
    );
  }
);

Toggle.displayName = 'Toggle';
