import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FileList from '../components/FileList';
import './Home.css';

function FolderView({ userId }) {
  const { folderId } = useParams();
  const navigate = useNavigate();

  const [directories, setDirectories] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null); // store info about the current folder

  useEffect(() => {
    // Simulate fetching current folder details (test data)
    let fakeCurrentFolder = null;
    let fakeDirectories = [];
    let fakeFiles = [];

    if (folderId === 'dir2') {
      // Documents
      fakeCurrentFolder = { _id: 'dir2', name: 'Documents', parent: null };
      fakeDirectories = [
        { _id: 'dir4', name: 'School', parent: 'dir2' },
        { _id: 'dir5', name: 'Work Reports', parent: 'dir2' },
      ];
      fakeFiles = [
        { _id: 'file4', filename: 'Thesis.docx', size: 1048576, parent: 'dir2' },
        { _id: 'file5', filename: 'Budget.xlsx', size: 204800, parent: 'dir2' },
      ];
    } else if (folderId === 'dir4') {
      // School (inside Documents)
      fakeCurrentFolder = { _id: 'dir4', name: 'School', parent: 'dir2' };
      fakeDirectories = [];
      fakeFiles = [
        { _id: 'file9', filename: 'Essay.docx', size: 51200, parent: 'dir4' },
      ];
    } else if (folderId === 'dir1') {
      // Photos
      fakeCurrentFolder = { _id: 'dir1', name: 'Photos', parent: null };
      fakeDirectories = [];
      fakeFiles = [
        { _id: 'file6', filename: 'Beach.png', size: 512000, parent: 'dir1' },
        { _id: 'file7', filename: 'Family.jpg', size: 1024000, parent: 'dir1' },
      ];
    } else {
      fakeCurrentFolder = null;
      fakeDirectories = [];
      fakeFiles = [];
    }

    setCurrentFolder(fakeCurrentFolder);
    setDirectories(fakeDirectories);
    setFiles(fakeFiles);

  }, [folderId]);

  const goBack = () => {
    if (currentFolder && currentFolder.parent) {
      navigate(`/folder/${currentFolder.parent}`);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <button onClick={goBack} className="back-button">⬅️ Back</button>
      <FileList directories={directories} files={files} />
    </>
  );
}

export default FolderView;
