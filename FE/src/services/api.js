import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // your express backend
});

// Get items inside a directory
export const getDirectoryContents = (parentId, userId) => 
    API.get(`/storage/${parentId}?userId=${userId}`);
  
  // Get root contents
  export const getRootContents = (userId) => 
    API.get(`/storage/root?userId=${userId}`);