// src/routes/api/upload/+server.js
import { Storage } from '@google-cloud/storage';
import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

const storage = new Storage();
const BUCKET_NAME = 'performance-thumbnails';
const bucket = storage.bucket(BUCKET_NAME);

export async function POST({ request }) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
      gzip: true
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        reject(json({ error: err.message }, { status: 500 }));
      });

      blobStream.on('finish', () => {
        // 버킷이 공개적으로 접근 가능하므로 makePublic() 호출 불필요
        const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;
        resolve(json({ url: publicUrl }));
      });

      blobStream.end(Buffer.from(fileBuffer));
    });
  } catch (error) {
    console.error('Upload error:', error);
    return json({ error: 'Upload failed' }, { status: 500 });
  }
}
