import { useState, useRef, useEffect } from 'react';
import './CreateButton.css';
import { FaPlus, FaFileUpload, FaFolderOpen } from 'react-icons/fa';

const CreateButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFolderPopup, setShowFolderPopup] = useState(false);
  const [folderName, setFolderName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const openFolderPopup = () => {
    setShowFolderPopup(true);
    setIsOpen(false);
  };

  const closeFolderPopup = () => {
    setShowFolderPopup(false);
    setFolderName('');
  };

  const handleSaveFolder = () => {
    // TODO: handle folder creation logic here
    closeFolderPopup();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (folderInputRef.current) {
      folderInputRef.current.setAttribute('webkitdirectory', '');
      folderInputRef.current.setAttribute('directory', '');
    }
  }, [isOpen]);

  return (
    <div className="create-button-wrapper" ref={dropdownRef}>
      <button className="create-button" onClick={toggleMenu}>
        <FaPlus className="icon" />
        Създаване
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <button
            className="dropdown-item"
            onClick={openFolderPopup}
            type="button"
          >
            <FaFolderOpen className="dropdown-icon" />
            Създаване на папка
          </button>
          <button
            className="dropdown-item"
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <FaFileUpload className="dropdown-icon" />
            Качване на файл
            <input
              ref={fileInputRef}
              id="file-upload-input"
              type="file"
              style={{ display: 'none' }}
              multiple
              onChange={() => {
                /* handle file upload here */
              }}
            />
          </button>
          <button
            className="dropdown-item"
            onClick={() => folderInputRef.current?.click()}
            type="button"
          >
            <FaFolderOpen className="dropdown-icon" />
            Качване на папка
            <input
              ref={folderInputRef}
              id="folder-upload-input"
              type="file"
              style={{ display: 'none' }}
              multiple
              onChange={() => {
                /* handle folder upload here */
              }}
            />
          </button>
        </div>
      )}

      {showFolderPopup && (
        <>
          <div className="overlay" onClick={closeFolderPopup} />
          <div className="popup-centered">
            <h3>Създаване на папка</h3>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Име на папка"
              autoFocus
            />
            <div className="popup-actions">
              <button onClick={handleSaveFolder}>Запази</button>
              <button onClick={closeFolderPopup}>Затвори</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateButton;
