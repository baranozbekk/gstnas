import React, { createContext, useContext, ReactNode } from 'react';
import { t as translate } from './index';

interface TranslationContextType {
  t: (key: string, defaultValue?: string) => string;
}

const TranslationContext = createContext<TranslationContextType>({
  t: (key: string, defaultValue?: string) => defaultValue || key,
});

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const value = {
    t: translate,
  };
  
  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);

export default TranslationContext; 