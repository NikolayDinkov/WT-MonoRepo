import React, { useState } from 'react';
import './CreateButton.css';
import { FaPlus, FaFileUpload, FaFolderOpen } from 'react-icons/fa';

const CreateButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="create-button-wrapper">
      <button className="create-button" onClick={toggleMenu}>
        <FaPlus className="icon" />
        Създаване
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <button className="dropdown-item">
            <FaFolderOpen className="dropdown-icon" />
            Създаване на папка
          </button>
          <button className="dropdown-item">
            <FaFileUpload className="dropdown-icon" />
            Качване на файл
          </button>
          <button className="dropdown-item">
            <FaFolderOpen className="dropdown-icon" />
            Качване на папка
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateButton;
