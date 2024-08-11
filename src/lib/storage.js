import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const bucketName = 'performance_csv_data';

export async function uploadFile({ buffer, filename }) {
  const bucket = storage.bucket(bucketName);
  const blob = bucket.file(filename);
  
  return new Promise((resolve, reject) => {
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => reject(err));
    blobStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
      resolve(publicUrl);
    });
    blobStream.end(buffer);
  });
}

export async function downloadFile(filename) {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);
    
    const [fileContent] = await file.download();
    return fileContent.toString('utf-8');
  }