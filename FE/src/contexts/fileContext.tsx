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
  sharedFiles: Element[];
  setSharedFiles: React.Dispatch<React.SetStateAction<Element[]>>;
  reloadFiles: () => Promise<void>;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: ReactNode }) {
  const [myDrive, setMyDrive] = useState<Element[]>([]);
  const [sharedFiles, setSharedFiles] = useState<Element[]>([]);
  const { isLoggedIn, userId } = useAuth();

  const reloadFiles = async () => {
    if (isLoggedIn && userId) {
      try {
        const files = await FileService.getUserElements();
        const shared = await FileService.getSharedElements();
        setSharedFiles(shared);
        setMyDrive(files);
      } catch (error) {
        setMyDrive([]);
        console.error('Failed to load files:', error);
      }
    } else {
      setMyDrive([]);
    }
  };

  useEffect(() => {
    reloadFiles();
  }, [isLoggedIn, userId]);

  return (
    <FileContext.Provider
      value={{ myDrive, setMyDrive, sharedFiles, setSharedFiles, reloadFiles }}
    >
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
