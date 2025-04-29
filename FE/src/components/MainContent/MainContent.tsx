import React from 'react';
import './MainContent.css';

interface MainContentProps {
  page: string;
}

const MainContent: React.FC<MainContentProps> = ({ page }) => {
  return (
    <div className="main-content">
      {page === 'myDrive' && <h1>Моят Диск</h1>}
      {page === 'shared' && <h1>Споделено с мен</h1>}
    </div>
  );
};

export default MainContent;
