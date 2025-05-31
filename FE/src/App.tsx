import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import { useEffect, useState } from 'react';
import { Element } from './interfaces/Element';
import Login from './components/Login/Login';
import Register from './components/Register/Register';

const App = () => {
  const [myDrive, setMyDrive] = useState<Element[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetch('http://localhost:3000/elements/662fb8a1e9e4c7a29b123abc', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => response.json())
        .then((res) => setMyDrive(res))
        .catch((error) => console.error(error));
    }
  }, [isLoggedIn]);

  return (
    <Router>
      <div className="app">
        {isLoggedIn ? (
          <>
            <Sidebar />
            <div className="main-area">
              <Header myDrive={myDrive} />
              <Routes>
                <Route
                  path="/my-drive/:directoryId?"
                  element={<MainContent page="myDrive" myDrive={myDrive} />}
                />
                <Route
                  path="/shared-with-me"
                  element={<MainContent page="shared" myDrive={myDrive} />}
                />
                <Route path="*" element={<Navigate to="/my-drive" replace />} />
              </Routes>
            </div>
          </>
        ) : (
          <>
            <Routes>
              <Route
                path="/login"
                element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />}
              />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
