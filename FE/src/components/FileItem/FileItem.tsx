import React from 'react';
import { File } from '../../interfaces/Element';
import './FileItem.css';
import ElementButtons from '../ElementButtons/ElementButtons';
import { FaFileAlt } from 'react-icons/fa';

interface FileItemProps {
  file: File;
  isMyFile: boolean;
  key: string;
}

const FileItem: React.FC<FileItemProps> = ({ file, isMyFile: isMyFile }) => {
  return (
    <div className="item-container">
      <div className="click-container">
        <FaFileAlt className="item-icon file" />
        <span className="item-name">{file.name}</span>
      </div>
      <ElementButtons
        elementId={file._id}
        elementType="file"
        section={isMyFile ? 'my-drive' : 'shared-with-me'}
        elementName={file.name}
      ></ElementButtons>
    </div>
  );
};

export default FileItem;
