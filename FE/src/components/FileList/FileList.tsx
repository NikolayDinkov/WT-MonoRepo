import React from 'react';
import FileItem from '../FileItem/FileItem';
import { Directory, File } from '../../interfaces/Element';
import DirectoryItem from '../DirectoryItem/DirectoryItem';

export interface FileListProps {
  directories: Directory[];
  files: File[];
  onDirectoryClick: (directory: Directory) => void;
}

const FileList: React.FC<FileListProps> = ({
  directories,
  files,
  onDirectoryClick,
}) => {
  console.log(directories, files);
  return (
    <div className="file-list">
      {directories.map((dir) => (
        <DirectoryItem
          key={dir._id}
          directory={dir}
          onClick={onDirectoryClick}
        />
      ))}
      {files.map((file) => (
        <FileItem key={file._id} file={file} />
      ))}
    </div>
  );
};

export default FileList;
