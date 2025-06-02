// src/app/providers/ModalStackProvider/ModalStackProvider.tsx
import { useState, useCallback } from 'react';
import { ModalStackContext } from './modalStackContext';

export const ModalStackProvider = ({ children }: { children: React.ReactNode }) => {
  const [stack, setStack] = useState<string[]>([]);

  const openModal = useCallback((id: string) => {
    setStack(prev => [...prev, id]);
  }, []);

  const closeModal = useCallback((id: string) => {
    setStack(prev => prev.filter(modalId => modalId !== id));
  }, []);

  return (
    <ModalStackContext.Provider value={{ openModal, closeModal, currentStack: stack }}>
      {children}
    </ModalStackContext.Provider>
  );
};
