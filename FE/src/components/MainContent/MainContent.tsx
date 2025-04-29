import React from 'react';
import './MainContent.css';
import { Directory, File } from '../../interfaces/Element';
import FileList from '../FileList/FileList';
import { useNavigate, useParams } from 'react-router-dom';
import { Element } from '../../interfaces/Element';

interface MainContentProps {
  page: string;
  myDrive: Element[];
}
// interface MainContentProps {
//   page: string;
//   directories: Directory[];
//   files: File[];
//   onDirectoryClick: (directory: Directory) => void;
//   goBack?: () => void;
// }

const MainContent: React.FC<MainContentProps> = ({ page, myDrive }) => {
  const { directoryId } = useParams<{ directoryId: string }>();
  const currentPath: string | null = directoryId || null;
  const navigate = useNavigate();

  const directories: Directory[] = myDrive.filter(
    (el): el is Directory =>
      el.type === 'directory' && el.parent === currentPath
  );
  const files: File[] = myDrive.filter(
    (el): el is File => el.type === 'file' && el.parent === currentPath
  );

  const handleDirectoryClick = (directory: Directory) => {
    console.log(directory._id);
    navigate(`/my-drive/${directory._id}`); // навигиране към новата директория
  };

  // const handleGoBack = () => {
  //   const currentDirectory = myDrive.find(
  //     (el) => el.type === 'directory' && el._id === currentPath
  //   );

  //   if (currentDirectory && currentDirectory.parent !== undefined) {
  //     setCurrentPath(currentDirectory.parent); // връщаме към родителя
  //   } else {
  //     setCurrentPath(null); // fallback
  //   }
  // };

  return (
    <div className="main-content">
      {page === 'myDrive' && (
        <>
          <h1>Моят Диск</h1>
          <FileList
            directories={directories}
            files={files}
            onDirectoryClick={handleDirectoryClick}
          />
        </>
      )}
      {page === 'shared' && <h1>Споделено с мен</h1>}
    </div>
  );
};

export default MainContent;
