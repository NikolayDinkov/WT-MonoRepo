import { useState } from 'react';
import { FaDownload, FaInfoCircle, FaShareAlt, FaTrash } from 'react-icons/fa';
import './ElementButtons.css';
import { ElementButtonsProps } from '../../interfaces/Element';
import {
  deleteElement,
  loadMetadata,
  downloadFile,
  FileService,
} from '../../services/FileService';
import { useFileContext } from '../../contexts/fileContext';
import { createPortal } from 'react-dom';

function handleDownload(
  e: React.MouseEvent<HTMLButtonElement>,
  elementId: string,
  metaData: any
) {
  e.stopPropagation();

  downloadFile(elementId)
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const filename = metaData?.filename || 'file';

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      alert('Грешка при тегленето на файла');
      console.error(error);
    });
}

export default function ElementButtons({
  elementId,
  elementType,
  section,
}: ElementButtonsProps) {
  const [popupType, setPopupType] = useState<
    null | 'info' | 'share' | 'delete'
  >(null);

  const [metaData, setMetadata] = useState<any>(null);

  const closePopup = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMetadata(null);
    setPopupType(null);
  };

  const { reloadFiles } = useFileContext();

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      await deleteElement(elementId);
      alert('Файлът беше изтрит успешно.');
      setPopupType(null);
    } catch (error) {
      alert('Грешка при изтриване на файла.');
      console.log(error);
    }
    reloadFiles();
  };

  const handleShare = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await FileService.shareElementWithUser({
        elementId,
        sharedWithUserName: e.currentTarget.username.value.trim(),
      });
      alert('Файлът беше споделен успешно.');
      setPopupType(null);
    } catch (error) {
      alert('Грешка при споделяне на файла.');
      console.error(error);
    }
  };

  return (
    <>
      <div className="element-buttons">
        {elementType === 'file' && (
          <>
            <button
              className="download-element-button"
              onClick={async (e) => {
                const data = await loadMetadata(elementId);
                setMetadata(data);
                handleDownload(e, elementId, data);
              }}
              title="Тегли файла"
            >
              <FaDownload />
            </button>

            <button
              className="info-element-button"
              onClick={async (e) => {
                e.stopPropagation();
                setPopupType('info');
                const data = await loadMetadata(elementId);
                setMetadata(data);
              }}
            >
              <FaInfoCircle />
            </button>
          </>
        )}

        {section === 'my-drive' && (
          <>
            {elementType === 'directory' && (
              <button
                className="share-element-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPopupType('share');
                }}
              >
                <FaShareAlt />
              </button>
            )}

            <button
              className="delete-element-button"
              onClick={(e) => {
                e.stopPropagation();
                setPopupType('delete');
              }}
            >
              <FaTrash />
            </button>
          </>
        )}
      </div>

      {popupType &&
        createPortal(
          <>
            <div className="overlay" onClick={closePopup} />
            <div
              className="popup-centered"
              onClick={(e) => e.stopPropagation()}
            >
              {popupType === 'info' && (
                <>
                  {metaData ? (
                    <div className="meta-info-details">
                      <p>
                        <strong>Име:</strong>{' '}
                        {metaData.filename || 'Няма данни'}
                      </p>
                      <p>
                        <strong>Размер:</strong>{' '}
                        {metaData.length
                          ? `${(metaData.length / 1024).toFixed(3)} KB`
                          : 'Няма данни'}
                      </p>
                      <p>
                        <strong>Създаден на:</strong>{' '}
                        {metaData.uploadDate
                          ? new Date(metaData.uploadDate).toLocaleString()
                          : 'Няма данни'}
                      </p>
                    </div>
                  ) : (
                    <p>Зареждане...</p>
                  )}
                </>
              )}
              {popupType === 'share' &&
                section === 'my-drive' &&
                elementType === 'directory' && (
                  <>
                    <h3>Споделяне на файла</h3>
                    <form onSubmit={handleShare}>
                      <input
                        type="text"
                        name="username"
                        placeholder="Username"
                      />
                      <button className="approve-share-button">Сподели</button>
                    </form>
                  </>
                )}
              {popupType === 'delete' && section === 'my-drive' && (
                <>
                  <h3>Сигурни ли сте, че искате да изтриете този файл?</h3>
                  <div className="popup-actions">
                    <button onClick={handleDelete}>Да</button>
                    <button onClick={closePopup}>Не</button>
                  </div>
                </>
              )}
              {popupType !== 'delete' && (
                <div className="popup-actions">
                  <button onClick={closePopup}>Затвори</button>
                </div>
              )}
            </div>
          </>,
          document.body
        )}
    </>
  );
}
