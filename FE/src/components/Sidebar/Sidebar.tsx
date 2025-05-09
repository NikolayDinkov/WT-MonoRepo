import './Sidebar.css';
import { FaHdd, FaUsers } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
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
        <NavLink
          to="/my-drive"
          className={({ isActive }) =>
            `sidebar-button ${isActive ? 'active' : ''}`
          }
        >
          <span className="sidebar-icon">
            <FaHdd />
          </span>
          Моят Диск
        </NavLink>

        <NavLink
          to="/shared-with-me"
          className={({ isActive }) =>
            `sidebar-button ${isActive ? 'active' : ''}`
          }
        >
          <span className="sidebar-icon">
            <FaUsers />
          </span>
          Споделено с мен
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
