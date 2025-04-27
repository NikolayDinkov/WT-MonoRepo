import { useEffect, useState } from 'react';
import { getDirectoryContents } from '../services/api';
import { useParams } from 'react-router-dom';
import FileList from '../components/FileList';

function FolderView({ userId }) {
  const { folderId } = useParams();
  const [directories, setDirectories] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    getDirectoryContents(folderId, userId)
      .then(res => {
        setDirectories(res.data.directories);
        setFiles(res.data.files);
      })
      .catch(err => console.error(err));
  }, [folderId, userId]);

  return (
    <div>
      <h1>Folder View</h1>
      <FileList directories={directories} files={files} />
    </div>
  );
}

export default FolderView;