import React from 'react';
import './MainContent.css';

interface MainContentProps {
  activePage: string;
}

const MainContent: React.FC<MainContentProps> = ({ activePage }) => {
  return (
    <div className="main-content">
      {activePage === 'myDrive' && <h1>Моят Диск</h1>}
      {activePage === 'shared' && <h1>Споделено с мен</h1>}
    </div>
  );
};

export default MainContent;
