// src/shared/ui/Select/Select.tsx

import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  type ReactNode,
  type ForwardedRef
} from 'react';
import {
  motion,
  AnimatePresence,
  type Variants
} from 'framer-motion';
import { Icon } from '@/shared/ui/Icon';
import { Loader } from '@/shared/ui/Loader';
import { useTheme } from '@/shared/ui/ThemeToggle';
import { cn } from '@/shared/lib/utils';
import styles from './Select.module.css';

export type SelectOption = {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
};

interface SelectProps {
  options: SelectOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  dropdownClassName?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 }
};

export const Select = forwardRef(
  (
    {
      options,
      value,
      onChange,
      multiple = false,
      searchable = false,
      placeholder = 'Select...',
      loading = false,
      disabled = false,
      className,
      dropdownClassName,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      ...props
    }: SelectProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { actualTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const selectRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOptions = options.filter(option =>
      Array.isArray(value) ? value.includes(option.value) : option.value === value
    );

    const handleSelect = (optionValue: string) => {
      if (multiple) {
        const newValue = Array.isArray(value) ? [...value] : [];
        const valueSet = new Set(newValue);
        if (valueSet.has(optionValue)) {
          valueSet.delete(optionValue);
        } else {
          valueSet.add(optionValue);
        }
        onChange(Array.from(valueSet));
      } else {
        onChange(optionValue);
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const sizeClasses = {
      sm: 'h-8 px-2 text-sm',
      md: 'h-10 px-3 text-base',
      lg: 'h-12 px-4 text-lg',
    };

    const variantClasses = {
      primary: 'bg-tg-theme-bg-color border-tg-theme-secondary-bg-color',
      outline: 'border-2 bg-transparent',
      ghost: 'bg-transparent border-transparent'
    };

    return (
      <div
        ref={selectRef}
        className={cn(
          'relative',
          fullWidth && 'w-full',
          className
        )}
      >
        <button
          type="button"
          className={cn(
            styles.trigger,
            variantClasses[variant],
            sizeClasses[size],
            'flex items-center justify-between gap-2',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <div className="flex flex-wrap items-center gap-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map(option => (
                <span
                  key={option.value}
                  className="flex items-center gap-1 bg-tg-theme-secondary-bg-color px-2 py-1 rounded"
                >
                  {option.icon}
                  {option.label}
                  {multiple && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(option.value);
                      }}
                      className="ml-1 hover:text-red-500"
                    >
                      <Icon name="close" size="sm" />
                    </button>
                  )}
                </span>
              ))
            ) : (
              <span className="text-tg-theme-hint-color">{placeholder}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {loading && <Loader size="sm" />}
            <Icon
              name={isOpen ? 'arrow-up' : 'arrow-down'}
              size="sm"
              className="text-tg-theme-hint-color"
            />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={cn(
                styles.dropdown,
                actualTheme === 'night' && styles.night,
                dropdownClassName
              )}
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {searchable && (
                <div className={styles.search}>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent outline-none"
                  />
                  <Icon name="search" size="sm" className="text-tg-theme-hint-color" />
                </div>
              )}

              <div className={styles.options}>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        styles.option,
                        (Array.isArray(value) 
                          ? value.includes(option.value)
                          : value === option.value) && styles.selected,
                        option.disabled && 'opacity-50 cursor-not-allowed'
                      )}
                      disabled={option.disabled}
                    >
                      {option.icon && (
                        <span className="mr-2">{option.icon}</span>
                      )}
                      {option.label}
                      {(Array.isArray(value) 
                        ? value.includes(option.value)
                        : value === option.value) && (
                        <Icon name="check" size="sm" className="ml-auto" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className={styles.empty}>
                    <Icon name="alert" size="sm" />
                    <span>No options found</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Select.displayName = 'Select';
