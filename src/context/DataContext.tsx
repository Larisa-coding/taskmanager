import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

type DataMode = 'local' | 'cloud';

interface DataContextType {
  mode: DataMode;
  setMode: (mode: DataMode) => void;
  userId: string | null;
}

const DataContext = createContext<DataContextType>({
  mode: 'local',
  setMode: () => {},
  userId: null
});

export const useDataMode = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [mode, setMode] = useState<DataMode>('local');

  useEffect(() => {
    // Если пользователь авторизован, используем облако
    if (user) {
      setMode('cloud');
    } else {
      setMode('local');
    }
  }, [user]);

  return (
    <DataContext.Provider value={{ mode, setMode, userId: user?.uid || null }}>
      {children}
    </DataContext.Provider>
  );
};

