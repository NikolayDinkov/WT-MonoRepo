import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import MyDrive from './components/MyDrive/MyDrive';
import SharedWithMe from './components/SharedWithMe/SharedWithMe';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';
import RequireAuth from './components/RequireAuth/RequireAuth';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route path="/my-drive/:directoryId?" element={<MyDrive />} />
          <Route
            path="/shared-with-me/:directoryId?"
            element={<SharedWithMe />}
          />
          <Route path="*" element={<Navigate to="/my-drive" replace />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
