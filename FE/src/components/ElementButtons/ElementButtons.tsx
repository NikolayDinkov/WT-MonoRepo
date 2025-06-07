import { useState } from 'react';
import { FaInfoCircle, FaShareAlt, FaTrash } from 'react-icons/fa';
import './ElementButtons.css';
import { ElementButtonsProps } from '../../interfaces/Element';

import { loadMetadata } from '../../services/FileService';

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

  return (
    <>
      <div className="element-buttons">
        {elementType === 'file' && (
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

      {popupType && (
        <>
          <div className="overlay" onClick={closePopup} />
          <div className="popup-centered">
            {popupType === 'info' && (
              <>
                {metaData ? (
                  <div className="meta-info-details">
                    <p>
                      <strong>Име:</strong> {metaData.filename || 'Няма данни'}
                    </p>
                    <p>
                      <strong>Размер:</strong>{' '}
                      {metaData.chunkSize
                        ? `${(metaData.chunkSize / 1024 / 1024).toFixed(2)} MB`
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
                  <input type="text" placeholder="Username" />
                  {/* share logic should be added here */}
                  <button className="approve-share-button">Сподели</button>
                </>
              )}
            {popupType === 'delete' && section === 'my-drive' && (
              <>
                <h3>Сигурни ли сте, че искате да изтриете този файл?</h3>
                <div className="popup-actions">
                  {/* delete logic should be added here */}
                  <button onClick={closePopup}>Да</button>
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
        </>
      )}
    </>
  );
}
