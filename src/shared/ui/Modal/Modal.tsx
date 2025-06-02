// src/shared/ui/Modal/Modal.tsx

import { 
  forwardRef,
  type ReactNode,
  useEffect 
} from 'react';
import { 
  motion, 
  AnimatePresence,
  type HTMLMotionProps 
} from 'framer-motion';
import { Icon } from '@/shared/ui/Icon';
import { Button } from '@/shared/ui/Button';
import { useTheme } from '@/shared/ui/ThemeToggle';
import { cn } from '@/shared/lib/utils';
import styles from './Modal.module.css';

interface ModalProps extends HTMLMotionProps<'div'> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  closeOnEsc?: boolean;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants = {
  hidden: { 
    opacity: 0,
    y: 50,
    scale: 0.95 
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      type: 'spring',
      damping: 25,
      stiffness: 400
    }
  }
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({
    isOpen,
    onClose,
    title,
    children,
    closeOnEsc = true,
    closeOnOverlayClick = true,
    showCloseButton = true,
    size = 'md',
    className,
    ...props
  }, ref) => {
    const { actualTheme } = useTheme();
    
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (closeOnEsc && e.key === 'Escape') onClose();
      };

      if (isOpen) {
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeyDown);
      }

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen, closeOnEsc, onClose]);

    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl'
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.overlay}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeOnOverlayClick ? onClose : undefined}
          >
            <motion.div
              ref={ref}
              className={cn(
                styles.modal,
                sizeClasses[size],
                actualTheme === 'night' ? styles.dark : styles.light,
                className
              )}
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
              {...props}
            >
              <div className={styles.header}>
                {title && (
                  <h2 className={styles.title}>
                    {title}
                  </h2>
                )}
                
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Close modal"
                  >
                    <Icon name="close" size="lg" />
                  </Button>
                )}
              </div>

              <div className={styles.content}>
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

Modal.displayName = 'Modal';
