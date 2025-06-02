// src/shared/ui/Notification/Notification.tsx

import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/shared/ui/Icon';
import { cn } from '@/shared/lib/utils';
import styles from './Notification.module.css';

type NotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'loading';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  icon?: ReactNode;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {}
});

const notificationIcons: Record<NotificationType, ReactNode> = {
  info: <Icon name="info" className="text-blue-500" />,
  success: <Icon name="check" className="text-green-500" />,
  warning: <Icon name="alert" className="text-yellow-500" />,
  error: <Icon name="close" className="text-red-500" />,
  loading: <Icon name="spinner" className="animate-spin" />
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    setNotifications(prev => [
      ...prev,
      { ...notification, id, duration: notification.duration || 5000 }
    ]);

    if (notification.duration !== 0) {
      setTimeout(() => removeNotification(id), notification.duration || 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

function NotificationContainer() {
  const { notifications } = useContext(NotificationContext);

  return (
    <div className={styles.container}>
      <AnimatePresence initial={false}>
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({ notification }: { notification: Notification }) {
  const { removeNotification } = useContext(NotificationContext);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (notification.duration === 0) return;

    const interval = setInterval(() => {
      setProgress(prev => Math.max(0, prev - 100 / ((notification.duration || 5000) / 50)));
    }, 50);

    return () => clearInterval(interval);
  }, [notification.duration]);

  return (
    <motion.div
      className={cn(styles.notification, styles[notification.type])}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className={styles.header}>
        <div className={styles.icon}>
          {notification.icon || notificationIcons[notification.type]}
        </div>
        <h3 className={styles.title}>{notification.title}</h3>
        <button
          className={styles.closeButton}
          onClick={() => removeNotification(notification.id)}
        >
          <Icon name="close" size="sm" />
        </button>
      </div>
      
      {notification.message && (
        <p className={styles.message}>{notification.message}</p>
      )}

      {notification.duration !== 0 && (
        <div className={styles.progressBar}>
          <motion.div
            className={styles.progress}
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: (notification.duration || 5000) / 1000 }}
          />
        </div>
      )}
    </motion.div>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
