import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';

const DashboardLayout = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-area">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
