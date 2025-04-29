import React from 'react';
import { FaFileAlt } from 'react-icons/fa';
import { File } from '../../interfaces/Element';
import './FileItem.css';

interface FileItemProps {
  file: File;
}

const FileItem: React.FC<FileItemProps> = ({ file }) => {
  // const formatSize = (bytes: number) => {
  //   if (bytes < 1024) return `${bytes} B`;
  //   if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  //   return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  // };

  return (
    <div className="item-container">
      <FaFileAlt className="item-icon file" />
      <span className="item-name">{file.name}</span>
      {/* <span className="file-size">{formatSize(file.size)}</span> */}
    </div>
  );
};

export default FileItem;
