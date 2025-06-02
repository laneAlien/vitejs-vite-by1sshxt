// src/shared/ui/Tag/Tag.tsx

import {
  forwardRef,
  useState,
  type ReactNode,
  type HTMLAttributes
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/shared/ui/Icon';
import { Loader } from '@/shared/ui/Loader';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '@/shared/ui/ThemeToggle';
import styles from './Tag.module.css';

export type TagVariant = 
  | 'primary'
  | 'outline'
  | 'ghost'
  | 'neutral';

export type TagSize = 'sm' | 'md' | 'lg';

interface TagProps extends HTMLAttributes<HTMLDivElement> {
  variant?: TagVariant;
  size?: TagSize;
  closable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  avatar?: string;
  onClose?: () => void;
  interactive?: boolean;
  selected?: boolean;
  fullWidth?: boolean;
}

const tagVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

export const Tag = forwardRef<HTMLDivElement, TagProps>(
  ({
    variant = 'primary',
    size = 'md',
    className,
    children,
    closable = false,
    disabled = false,
    loading = false,
    icon,
    avatar,
    onClose,
    interactive = false,
    selected = false,
    fullWidth = false,
    ...props
  }, ref) => {
    const { actualTheme } = useTheme();
    const [isClosed, setIsClosed] = useState(false);
    const isDark = actualTheme === 'night';

    const sizeClasses = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-3 py-1.5 text-base',
      lg: 'px-4 py-2 text-lg',
    };

    const variantClasses = {
      primary: cn(
        'bg-tg-theme-link-color text-white',
        interactive && 'hover:bg-opacity-90',
        selected && 'ring-2 ring-tg-theme-secondary-bg-color'
      ),
      outline: cn(
        'border bg-transparent',
        isDark
          ? 'border-tg-theme-hint-color text-tg-theme-text-color'
          : 'border-tg-theme-secondary-bg-color text-tg-theme-text-color',
        interactive && 'hover:border-tg-theme-link-color',
        selected && 'border-tg-theme-link-color'
      ),
      ghost: cn(
        'bg-tg-theme-secondary-bg-color/30',
        interactive && 'hover:bg-tg-theme-secondary-bg-color'
      ),
      neutral: 'bg-tg-theme-secondary-bg-color text-tg-theme-text-color'
    };

    const handleClose = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!disabled && !loading) {
        setIsClosed(true);
        onClose?.();
      }
    };

    if (isClosed) return null;

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={tagVariants}
        className={cn(
          styles.tag,
          sizeClasses[size],
          variantClasses[variant],
          disabled && 'opacity-50 pointer-events-none',
          fullWidth && 'w-full',
          interactive && 'cursor-pointer',
          'inline-flex items-center rounded-tg transition-all',
          className
        )}
        {...props}
      >
        {loading && (
          <Loader 
            size={size} 
            className="mr-1.5" 
          />
        )}

        {avatar && (
          <img
            src={avatar}
            className={cn(
              'rounded-full object-cover mr-2',
              size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'
            )}
            alt="Аватар"
          />
        )}

        {icon && !loading && (
          <span className="mr-1.5 flex items-center">
            {icon}
          </span>
        )}

        <span className="truncate">{children}</span>

        {closable && !loading && (
          <button
            type="button"
            onClick={handleClose}
            className={cn(
              'ml-1.5 rounded-full hover:bg-black/10 p-0.5',
              'transition-colors flex items-center'
            )}
          >
            <Icon 
              name="close" 
              size={size === 'lg' ? 'sm' : 'xs'} 
              className="opacity-70 hover:opacity-100" 
            />
          </button>
        )}
      </motion.div>
    );
  }
);

Tag.displayName = 'Tag';

// Группа тегов
interface TagGroupProps extends HTMLAttributes<HTMLDivElement> {
  tags: ReactNode[];
  gap?: 'sm' | 'md' | 'lg';
  wrap?: boolean;
}

export const TagGroup = forwardRef<HTMLDivElement, TagGroupProps>(
  ({ tags, gap = 'md', wrap = true, className, ...props }, ref) => {
    const gapClasses = {
      sm: 'gap-1',
      md: 'gap-2',
      lg: 'gap-3',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap',
          gapClasses[gap],
          wrap ? 'flex-wrap' : 'overflow-x-auto',
          className
        )}
        {...props}
      >
        {tags.map((tag, index) => (
          <AnimatePresence key={index}>
            {tag}
          </AnimatePresence>
        ))}
      </div>
    );
  }
);

TagGroup.displayName = 'TagGroup';
