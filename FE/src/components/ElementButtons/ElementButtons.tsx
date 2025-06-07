import { useEffect, useState } from 'react';
import { FaInfoCircle, FaShareAlt, FaTrash } from 'react-icons/fa';
import './ElementButtons.css';
import getAuthToken from '../../services/AuthService';
import { ElementButtonsProps } from '../../interfaces/Element';
import axios from 'axios';

export default function ElementButtons({
  onlyInfo = false,
  elementId,
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

  const loadMetadata = async () => {
    if (!elementId) {
      console.log(elementId);
      alert('Грешка при зареждане на мета информация1.');
      return;
    }
    const token = getAuthToken();
    try {
      const response = await axios.get(`/elements/metadata/${elementId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMetadata(response.data);
      console.log('Meta data:', response.data);
    } catch (err: any) {
      alert('Грешка при зареждане на мета информация');
      console.error(
        'Error loading metadata:',
        err?.response?.data || err.message
      );
    }
  };

  return (
    <>
      <div className="element-buttons">
        <button
          className="info-element-button"
          onClick={(e) => {
            e.stopPropagation();
            setPopupType('info');
            loadMetadata();
          }}
        >
          <FaInfoCircle />
        </button>

        {!onlyInfo && (
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
                  <pre className="meta-info-box">
                    {JSON.stringify(metaData, null, 2)}
                  </pre>
                ) : (
                  <p>Зареждане...</p>
                )}
              </>
            )}
            {popupType === 'share' && !onlyInfo && (
              <>
                <h3>Споделяне на файла</h3>
                <input type="text" placeholder="Username" />
                {/* share logic should be added here */}
                <button className="approve-share-button">Сподели</button>
              </>
            )}
            {popupType === 'delete' && !onlyInfo && (
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
