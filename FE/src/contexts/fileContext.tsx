import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { FileService } from '../services/FileService';
import { Element } from '../interfaces/Element';
import { useAuth } from './authContext';

interface FileContextType {
  myDrive: Element[];
  setMyDrive: React.Dispatch<React.SetStateAction<Element[]>>;
  reloadFiles: () => Promise<void>;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
  const [myDrive, setMyDrive] = useState<Element[]>([]);
  const { isLoggedIn, userId } = useAuth();

  const reloadFiles = async () => {
    if (isLoggedIn && userId) {
      try {
        const files = await FileService.getUserElements(userId);
        setMyDrive(files);
      } catch (error) {
        setMyDrive([]);
        // Optionally handle error
      }
    } else {
      setMyDrive([]);
    }
  };

  useEffect(() => {
    reloadFiles();
  }, [reloadFiles]);

  return (
    <FileContext.Provider value={{ myDrive, setMyDrive, reloadFiles }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFileContext() {
  const context = useContext(FileContext);
  if (!context)
    throw new Error('useFileContext must be used within a FileProvider');
  return context;
}
