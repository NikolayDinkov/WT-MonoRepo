import { Link } from 'react-router-dom';
import './DirectoryItem.css';

function DirectoryItem({ directory }) {
  return (
    <div className="file-item">
      📁 <Link to={`/folder/${directory._id}`}>{directory.name}</Link>
    </div>
  );
}

export default DirectoryItem;