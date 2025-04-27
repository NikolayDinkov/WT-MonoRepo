import './FileItem.css';

function FileItem({ file }) {
    return (
      <div className="file-item">
        📄 {file.filename} ({(file.size / 1024).toFixed(1)} KB)
      </div>
    );
  }
  
  export default FileItem;