import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import { FiSearch, FiX, FiFolder, FiFileText, FiUser } from 'react-icons/fi';
import { useFileContext } from '../../contexts/fileContext';

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'directory' | 'file'>(
    'all'
  );
  const [searchIn, setSearchIn] = useState<'my-drive' | 'shared-with-me'>(
    'my-drive'
  );

  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { myDrive, sharedFiles } = useFileContext();

  function handleLogout() {
    localStorage.removeItem('token');
    window.location.reload();
  }

  const collectionForFilter = searchIn === 'my-drive' ? myDrive : sharedFiles;

  const filteredElements = collectionForFilter.filter((el) => {
    const matchesText = el.name
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());
    const matchesType = filterType === 'all' || el.type === filterType;
    return matchesText && matchesType;
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="header">
      <div className="search-wrapper" ref={wrapperRef}>
        <FiSearch className="search-icon" />
        <input
          type="text"
          className="search-bar"
          placeholder="Търсете в Диск"
          value={searchTerm}
          onFocus={() => setShowResults(true)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(true);
          }}
        />
        {searchTerm && (
          <FiX
            className="clear-icon"
            onClick={() => {
              setSearchTerm('');
              setShowResults(false);
            }}
          />
        )}
        {searchTerm && showResults && (
          <div className="search-results">
            <div className="vertical-options">
              <div className="search-filter">
                <label htmlFor="type-select">Търсене по:</label>
                <select
                  id="type-select"
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(
                      e.target.value as 'all' | 'directory' | 'file'
                    )
                  }
                >
                  <option value="all">Всичко</option>
                  <option value="directory">Директории</option>
                  <option value="file">Файлове</option>
                </select>
              </div>

              <div className="search-filter">
                <label htmlFor="type-select">Търсене в:</label>
                <select
                  id="type-select"
                  value={searchIn}
                  onChange={(e) =>
                    setSearchIn(e.target.value as 'my-drive' | 'shared-with-me')
                  }
                >
                  <option value="my-drive">Моят drive</option>
                  <option value="shared-with-me">Споделено с мен</option>
                </select>
              </div>
            </div>

            {filteredElements.length > 0 ? (
              filteredElements.map((element, idx) => (
                <NavLink
                  to={
                    searchIn === 'my-drive'
                      ? element.parent
                        ? `/my-drive/${element.parent}`
                        : '/my-drive'
                      : element.parent
                        ? `/shared-with-me/${element.parent}`
                        : '/shared-with-me'
                  }
                  key={idx}
                  className="search-result-item"
                  onClick={() => setShowResults(false)}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {element.type === 'directory' ? (
                      <FiFolder className="result-icon" />
                    ) : (
                      <FiFileText className="result-icon" />
                    )}
                    <div>
                      <div className="element-title">{element.name}</div>
                      <div className="element-path">{element.path}</div>
                    </div>
                  </div>
                </NavLink>
              ))
            ) : (
              <div className="no-results">Няма резултати</div>
            )}
          </div>
        )}
      </div>
      <div className="dropdown-container" ref={dropdownRef}>
        <button
          className="drop-button"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <FiUser size={30}></FiUser>
        </button>
        {showDropdown && (
          <>
            <div className="dropdown-profile-menu">
              <button className="exit-button" onClick={handleLogout}>
                Изход
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
