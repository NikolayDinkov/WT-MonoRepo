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
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import { useAuth } from './contexts/authContext';
import { useFileContext } from './contexts/fileContext';

const App = () => {
  const { isLoggedIn } = useAuth();
  const { myDrive } = useFileContext();

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
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
