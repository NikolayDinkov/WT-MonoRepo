import React from 'react';
import './Sidebar.css';
import { FaHdd, FaUsers } from 'react-icons/fa';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img
          src="https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png"
          alt="Logo"
        />
        <span className="sidebar-title">Диск</span>
      </div>

      <div className="sidebar-buttons">
        <button
          className={`sidebar-button ${activePage === 'myDrive' ? 'active' : ''}`}
          onClick={() => setActivePage('myDrive')}
        >
          <FaHdd className="sidebar-icon" />
          Моят Диск
        </button>
        <button
          className={`sidebar-button ${activePage === 'shared' ? 'active' : ''}`}
          onClick={() => setActivePage('shared')}
        >
          <FaUsers className="sidebar-icon" />
          Споделено с мен
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
