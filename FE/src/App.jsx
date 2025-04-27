import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FolderView from './pages/FolderView';

function App() {
  const userId = '60b8d2b8f5a8c72b4e5d5c5e'; // your test logged-in user

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home userId={userId} />} />
        <Route path="/folder/:folderId" element={<FolderView userId={userId} />} />
      </Routes>
    </Router>
  );
}

export default App;