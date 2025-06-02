// src/shared/ui/Calendar/Calendar.tsx
import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import styles from './Calendar.module.css';

const Calendar = ({ onDateSelect }: { onDateSelect: (date: Date) => void }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'days' | 'months' | 'years'>('days');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const gridAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  });

  const handleDateSelect = (date: Date) => {
    onDateSelect(date);
    setCurrentDate(date);
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={() => setViewMode('months')}>
          {format(currentDate, 'LLLL')}
        </button>
        <button onClick={() => setViewMode('years')}>
          {format(currentDate, 'yyyy')}
        </button>
      </div>

      <animated.div style={gridAnimation} className={styles.grid}>
        {daysInMonth.map((day) => (
          <button
            key={day.toISOString()}
            className={`${styles.day} ${
              !isSameMonth(day, currentDate) ? styles.outside : ''
            }`}
            onClick={() => handleDateSelect(day)}
          >
            {format(day, 'd')}
          </button>
        ))}
      </animated.div>
    </div>
  );
};

export default Calendar;
