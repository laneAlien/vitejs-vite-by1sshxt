import { createContext, useContext } from 'react';

export type ModalStackContextType = {
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  currentStack: string[];
};

export const ModalStackContext = createContext<ModalStackContextType>({
  openModal: () => {},
  closeModal: () => {},
  currentStack: [],
});

export const useModalStack = () => useContext(ModalStackContext);