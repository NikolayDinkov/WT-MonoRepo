import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

export function upload() {
  const MONGO_URI = process.env.MONGO_URI as string;

  const storage = new GridFsStorage({
    url: MONGO_URI,
    file: (req, file) => {
      return new Promise((resolve, _reject) => {
        const fileInfo = {
          filename: file.originalname,
          bucketName: 'filesBucket',
        };
        resolve(fileInfo);
      });
    },
  });

  console.log('upload function called');
  return multer({ storage: storage as unknown as multer.StorageEngine });
}
