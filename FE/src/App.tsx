import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';

const App = () => {
  const [activePage, setActivePage] = useState('myDrive');

  return (
    <div className="app">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-area">
        <Header />
        <MainContent activePage={activePage} />
      </div>
    </div>
  );
};

export default App;
