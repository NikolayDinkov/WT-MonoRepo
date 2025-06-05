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
import { jwtDecode } from 'jwt-decode';
import JwtPayload from './interfaces/JwtPayload';

const App = () => {
  const [myDrive, setMyDrive] = useState<Element[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUserId(decoded.userId);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        setUserId(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserId(null);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && userId) {
      fetch(`http://localhost:3000/elements/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => response.json())
        .then((res) => setMyDrive(res))
        .catch((error) => console.error(error));
    }
  }, [isLoggedIn, userId]);

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
              <Route
                path="/register"
                element={
                  <Register onRegisterSuccess={() => setIsLoggedIn(true)} />
                }
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
