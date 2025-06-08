import React from 'react';
import { FaFolder } from 'react-icons/fa';
import { Directory } from '../../interfaces/Element';
import './DirectoryItem.css';
import ElementButtons from '../ElementButtons/ElementButtons';

export interface DirectoryItemProps {
  directory: Directory;
  onClick: (directory: Directory) => void;
  isMyFile: boolean;
}

const DirectoryItem: React.FC<DirectoryItemProps> = ({
  directory,
  onClick,
  isMyFile: isMyFile,
}) => {
  return (
    <div className="item-container" onClick={() => onClick(directory)}>
      <div className="click-container">
        <FaFolder />
        <span className="item-name">{directory.name}</span>
      </div>
      <ElementButtons
        elementType="directory"
        section={isMyFile ? 'my-drive' : 'shared-with-me'}
        elementId={directory._id}
      ></ElementButtons>
    </div>
  );
};

export default DirectoryItem;
