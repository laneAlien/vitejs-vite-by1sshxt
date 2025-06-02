// src/shared/ui/Modal/SwipeableModal.tsx

import { 
  useState, 
  useEffect, 
  useCallback,
  forwardRef,
  type ForwardedRef,
  type ReactNode
} from 'react';
import { useDrag } from '@use-gesture/react';
import { animated, useSpring } from '@react-spring/web';
import { useModalStack } from '@/app/providers/ModalStackProvider';
import { useTheme } from '@/shared/ui/ThemeToggle';
import { useWebApp } from '@/shared/lib/telegram/WebAppProvider';
import { Icon } from '@/shared/ui/Icon';
import { Loader } from '@/shared/ui/Loader';
import { cn } from '@/shared/lib/utils';
import styles from './SwipeableModal.module.css';

export interface SwipeableModalProps {
  id: string; // Обязательный идентификатор модалки
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  loading?: boolean;
  onClose?: () => void;
  closeThreshold?: number;
  swipeVelocity?: number;
  disableSwipe?: boolean;
  showCloseButton?: boolean;
  overlayOpacity?: number;
  className?: string;
}

const SwipeableModal = forwardRef(
  (
    {
      id,
      title,
      children,
      footer,
      loading = false,
      onClose,
      closeThreshold = 0.4,
      swipeVelocity = 0.5,
      disableSwipe = false,
      showCloseButton = true,
      overlayOpacity = 0.4,
      className
    }: SwipeableModalProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { themeParams } = useWebApp();
    const { theme } = useTheme();
    const { currentStack, closeModal } = useModalStack();
    const [isClosing, setIsClosing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const isActive = currentStack[currentStack.length - 1] === id;

    const [{ y, scale, opacity }, api] = useSpring(() => ({
      y: isActive ? 0 : 200,
      scale: isActive ? 1 : 0.9,
      opacity: isActive ? overlayOpacity : 0,
      config: { tension: 400, friction: 30 }
    }));

    const handleClose = useCallback(() => {
      closeModal(id);
      onClose?.();
    }, [closeModal, id, onClose]);

    const closeHandler = useCallback(() => {
      setIsClosing(true);
      api.start({
        y: 200,
        scale: 0.9,
        opacity: 0,
        onRest: () => {
          handleClose();
          setIsClosing(false);
        }
      });
    }, [api, handleClose]);

    const bind = useDrag(
      ({ down, movement: [, my], velocity: [, vy], direction: [, dy] }) => {
        if (disableSwipe || isClosing || !isActive) return;

        const triggerClose = 
          (my > window.innerHeight * closeThreshold) || 
          (vy > swipeVelocity && dy > 0);

        setIsDragging(down);

        api.start({
          y: down ? my : 0,
          scale: down ? 1 - Math.abs(my / 1000) : 1,
          opacity: down ? overlayOpacity - Math.abs(my / 1000) : overlayOpacity,
          immediate: down,
          onRest: () => {
            if (!down && triggerClose) {
              closeHandler();
            }
          }
        });
      },
      {
        filterTaps: true,
        bounds: { top: 0 },
        rubberband: true,
        axis: 'y'
      }
    );

    useEffect(() => {
      if (isActive && !disableSwipe) {
        window.Telegram?.WebApp?.enableClosingConfirmation();
      }
      return () => {
        window.Telegram?.WebApp?.disableClosingConfirmation();
      };
    }, [isActive, disableSwipe]);

    if (!isActive) return null;

    return (
      <animated.div 
        className={styles.overlay}
        style={{ opacity }}
      >
        <animated.div
          ref={ref}
          {...(!disableSwipe ? bind() : {})}
          className={cn(
            styles.modal,
            className,
            theme === 'night' && styles.nightTheme,
            isDragging && styles.dragging
          )}
          style={{
            y,
            scale,
            backgroundColor: themeParams.bg_color,
            color: themeParams.text_color
          }}
        >
          {showCloseButton && (
            <button
              className={styles.closeButton}
              onClick={closeHandler}
              style={{ color: themeParams.text_color }}
            >
              <Icon name="close" className={styles.closeIcon} />
            </button>
          )}

          <div className={styles.content}>
            {title && (
              <h2 
                className={styles.title}
                style={{ color: themeParams.text_color }}
              >
                {title}
              </h2>
            )}

            <div className={styles.body}>
              {loading ? (
                <div className={styles.loader}>
                  <Loader variant="tg" size="lg" />
                </div>
              ) : children}
            </div>

            {footer && (
              <div 
                className={styles.footer}
                style={{ borderColor: themeParams.hint_color }}
              >
                {footer}
              </div>
            )}
          </div>
        </animated.div>
      </animated.div>
    );
  }
);

SwipeableModal.displayName = 'SwipeableModal';

export default SwipeableModal;
