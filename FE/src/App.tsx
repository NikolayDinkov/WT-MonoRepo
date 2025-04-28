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

const App = () => {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-area">
          <Header />
          <Routes>
            <Route path="/my-drive" element={<MainContent page="myDrive" />} />
            <Route
              path="/shared-with-me"
              element={<MainContent page="shared" />}
            />
            <Route path="*" element={<Navigate to="/my-drive" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
