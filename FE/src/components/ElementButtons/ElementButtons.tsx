import { useState } from 'react';
import {
  FaDownload,
  FaInfoCircle,
  FaShareAlt,
  FaTrash,
  FaEdit,
} from 'react-icons/fa';
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
  elementName,
}: ElementButtonsProps) {
  const [popupType, setPopupType] = useState<
    null | 'info' | 'share' | 'delete' | 'rename'
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
      console.error(error);
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

  const handleRename = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await FileService.renameElement({
        elementId,
        newName:
          e.currentTarget.newname.value.trim() +
          (elementType === 'file'
            ? '.' + elementName.split('.').slice(1).join('.')
            : ''),
      });
      alert('Името беше променено успешно.');
      setPopupType(null);
      reloadFiles();
    } catch (error) {
      alert('Грешка при преименуване на файла.');
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
              <>
                <button
                  className="share-element-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPopupType('share');
                  }}
                >
                  <FaShareAlt />
                </button>
              </>
            )}
            <button
              className="rename-element-button"
              onClick={async (e) => {
                e.stopPropagation();
                setPopupType('rename');
              }}
            >
              <FaEdit />
            </button>

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
                      <div className="popup-actions">
                        <button type="button" onClick={closePopup}>
                          Затвори
                        </button>
                      </div>
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
                        className="share-input"
                        required
                      />
                      <div className="popup-actions">
                        <button type="button" onClick={closePopup}>
                          Затвори
                        </button>
                        <button type="submit">Сподели</button>
                      </div>
                    </form>
                  </>
                )}
              {popupType === 'rename' && section === 'my-drive' && (
                <>
                  <h3>
                    Преименуване на{' '}
                    {elementType === 'file' ? 'файл' : 'директория'}
                  </h3>
                  <form onSubmit={handleRename}>
                    <input
                      type="text"
                      name="newname"
                      placeholder="Ново име"
                      className="share-input"
                      required
                      defaultValue={
                        elementName?.split('.')[0] || elementName || ''
                      }
                    />
                    <div className="popup-actions">
                      <button type="button" onClick={closePopup}>
                        Затвори
                      </button>
                      <button type="submit">Преименувай</button>
                    </div>
                  </form>
                </>
              )}
              {popupType === 'delete' && section === 'my-drive' && (
                <>
                  <h3>
                    Сигурни ли сте, че искате да изтриете
                    {elementType === 'file' ? ' този файл' : ' тази директория'}
                    ?
                  </h3>
                  <div className="popup-actions">
                    <button onClick={closePopup}>Не</button>
                    <button onClick={handleDelete}>Да</button>
                  </div>
                </>
              )}
            </div>
          </>,
          document.body
        )}
    </>
  );
}
