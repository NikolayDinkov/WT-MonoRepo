import { useEffect, useState } from 'react';
import FileList from '../components/FileList';
import './Home.css';

function Home({ userId }) {
  const [directories, setDirectories] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // ТЕСТОВИ ДАННИ
    const fakeDirectories = [
      { _id: 'dir1', name: 'Photos' },
      { _id: 'dir2', name: 'Documents' },
      { _id: 'dir3', name: 'Work Projects' },
    ];

    const fakeFiles = [
      { _id: 'file1', filename: 'Resume.pdf', size: 24576 },
      { _id: 'file2', filename: 'Vacation.jpg', size: 512000 },
      { _id: 'file3', filename: 'Notes.txt', size: 1024 },
    ];

    setDirectories(fakeDirectories);
    setFiles(fakeFiles);

    // АКО искаш после да върнеш зареждане от бекенда:
    /*
    getRootContents(userId)
      .then(res => {
        setDirectories(res.data.directories);
        setFiles(res.data.files);
      })
      .catch(err => console.error(err));
    */
  }, []);

  return (
    <FileList directories={directories} files={files} />
  );
}

export default Home;
