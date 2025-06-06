import React from 'react';
import './MainContent.css';
import { Directory, File } from '../../interfaces/Element';
import FileList from '../FileList/FileList';
import { useNavigate, useParams } from 'react-router-dom';
import { useFileContext } from '../../contexts/fileContext';

interface MainContentProps {
  page: string;
}

const MainContent: React.FC<MainContentProps> = ({ page }) => {
  const { directoryId } = useParams<{ directoryId: string }>();
  const { myDrive } = useFileContext();
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
    navigate(`/my-drive/${directory._id}`); // Navigate to the clicked directory
  };

  return (
    <div className="main-content">
      {page === 'myDrive' && (
        <>
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
