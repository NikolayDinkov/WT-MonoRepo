import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import FolderView from './pages/FolderView';

function Layout() {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>My Drive</h1> {/* Само тук My Drive */}
      </header>
      <main className="home-main">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  const userId = '60b8d2b8f5a8c72b4e5d5c5e';

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home userId={userId} />} />
          <Route path="/folder/:folderId" element={<FolderView userId={userId} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
