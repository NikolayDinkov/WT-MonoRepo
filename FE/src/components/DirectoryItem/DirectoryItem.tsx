import React from 'react';
import { FaFolder } from 'react-icons/fa';
import { Directory } from '../../interfaces/Element';
import './DirectoryItem.css';

export interface DirectoryItemProps {
  directory: Directory;
  onClick: (directory: Directory) => void;
}

const DirectoryItem: React.FC<DirectoryItemProps> = ({
  directory,
  onClick,
}) => {
  return (
    <div className="item-container" onClick={() => onClick(directory)}>
      <div className="item-icon folder">
        <FaFolder />
      </div>
      <span className="item-name">{directory.name}</span>
    </div>
  );
};

export default DirectoryItem;
