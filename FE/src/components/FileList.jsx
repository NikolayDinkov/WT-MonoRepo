import DirectoryItem from './DirectoryItem';
import FileItem from './FileItem';
import './FileList.css';

function FileList({ directories = [], files = [] }) {
    if (!directories.length && !files.length) {
        return <div className="no-content">No files or folders here.</div>;
      }

  return (
    <div className="file-list">
      {directories.map(dir => (
        <DirectoryItem key={dir._id} directory={dir} />
      ))}
      {files.map(file => (
        <FileItem key={file._id} file={file} />
      ))}
    </div>
  );
}

export default FileList;