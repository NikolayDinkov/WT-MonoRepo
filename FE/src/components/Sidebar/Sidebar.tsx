import './Sidebar.css';
import { FaHdd, FaUsers } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import CreateButton from '../CreateButton/CreateButton';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <NavLink to="/" className="sidebar-header">
        <img src="assets/google-drive-icon.png" alt="Logo" />
        <span className="sidebar-title">Диск</span>
      </NavLink>

      <CreateButton></CreateButton>

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
