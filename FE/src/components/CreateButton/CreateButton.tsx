import { useState, useRef, useEffect } from 'react';
import './CreateButton.css';
import { FaPlus, FaFileUpload, FaFolderOpen } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FileService } from '../../services/FileService';
import { useFileContext } from '../../contexts/fileContext';

const CreateButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFolderPopup, setShowFolderPopup] = useState(false);
  const [folderName, setFolderName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const { directoryId } = useParams<{ directoryId?: string }>();
  const { reloadFiles } = useFileContext();
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const isMyDrive = path.includes('/my-drive');

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

  const handleSaveFolder = async () => {
    if (!folderName.trim()) {
      alert('Please enter a folder name');
      return;
    }
    try {
      if (isMyDrive) {
        await FileService.createDirectory({
          name: folderName,
          parent: directoryId || null,
        });
      } else {
        await FileService.createDirectory({
          name: folderName,
          parent: null,
        });
        navigate('/my-drive');
      }
    } catch (_) {
      alert('Error creating folder');
    } finally {
      reloadFiles();
      closeFolderPopup();
    }
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
              onChange={async (e) => {
                const files = e.target.files;
                if (!files || files.length === 0) return;
                try {
                  await FileService.uploadFiles({
                    files,
                    parentId: directoryId || null,
                  });
                  reloadFiles();
                } catch (err) {
                  alert('Error uploading files');
                } finally {
                  setIsOpen(false);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }
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
              <button onClick={closeFolderPopup}>Затвори</button>
              <button onClick={handleSaveFolder}>Запази</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateButton;
