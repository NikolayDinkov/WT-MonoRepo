import { useEffect, useState } from 'react';
import { getRootContents } from '../services/api';
import FileList from '../components/FileList';
import './Home.css'; // нов CSS за тази страница

function Home({ userId }) {
  const [directories, setDirectories] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    getRootContents(userId)
      .then(res => {
        setDirectories(res.data.directories);
        setFiles(res.data.files);
      })
      .catch(err => console.error(err));
  }, [userId]);

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>My Drive</h1>
      </header>
      <main className="home-main">
        <FileList directories={directories} files={files} />
      </main>
    </div>
  );
}

export default Home;
