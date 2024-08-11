// src/routes/api/upload-historical-data/+server.js
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';
import { uploadFile } from '$lib/storage';
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from 'node:buffer';

export async function POST({ request }) {
    try {
        const data = await request.formData();
        const file = data.get('file');
        const performanceId = data.get('performanceId');

        if (!file || !performanceId) {
            return json({ error: 'Missing file or performance ID' }, { status: 400 });
        }

        console.log('File details:', {
            type: typeof file,
            constructor: file.constructor.name,
            properties: Object.keys(file)
        });

        let buffer;
        let filename;

        if (typeof file === 'string') {
            // If file is a string, it's likely the file path
            buffer = Buffer.from(file);
            filename = file.split('/').pop(); // Extract filename from path
        } else if (file instanceof Blob) {
            buffer = Buffer.from(await file.arrayBuffer());
            filename = file.name;
        } else {
            throw new Error('Unsupported file type');
        }

        const fileExtension = filename.split('.').pop();
        const uniqueFilename = `${uuidv4()}.${fileExtension}`;

        const fileUrl = await uploadFile({ buffer, filename: uniqueFilename });

        const { data: uploadData, error } = await supabase
            .from('historical_data')
            .insert({
                performance_id: performanceId,
                filename: filename,
                file_url: fileUrl,
                record_count: 0 // 이 값은 나중에 업데이트할 수 있습니다
            });

        if (error) throw error;

        return json({ success: true, uploadData });
    } catch (error) {
        console.error('Upload error:', error);
        return json({ error: 'Upload failed: ' + error.message }, { status: 500 });
    }
}