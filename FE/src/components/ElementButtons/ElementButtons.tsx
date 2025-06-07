import { useState } from 'react';
import { FaInfoCircle, FaShareAlt, FaTrash } from 'react-icons/fa';
import './ElementButtons.css';
import { ElementButtonsProps } from '../../interfaces/Element';

export default function ElementButtons({
  elementType,
  section,
}: ElementButtonsProps) {
  const [popupType, setPopupType] = useState<
    null | 'info' | 'share' | 'delete'
  >(null);

  const closePopup = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setPopupType(null);
  };

  return (
    <>
      <div className="element-buttons">
        {elementType === 'file' && (
          <button
            className="info-element-button"
            onClick={(e) => {
              e.stopPropagation();
              setPopupType('info');
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
            {popupType === 'info' && <h3>Информация за файла</h3>}
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
