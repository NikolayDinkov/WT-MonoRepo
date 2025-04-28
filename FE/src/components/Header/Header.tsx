import React from 'react';
import './Header.css';
import { FiSearch } from 'react-icons/fi'; // Импортираме иконата лупа
import { HeaderProps } from '../../interfaces/HeaderProps';

const Header: React.FC<HeaderProps> = ({ myDrive }) => {
  return (
    <div className="header">
      <div className="search-wrapper">
        <FiSearch className="search-icon" />
        <input
          type="text"
          className="search-bar"
          placeholder="Търсете в Диск"
        />
      </div>
    </div>
  );
};

export default Header;
