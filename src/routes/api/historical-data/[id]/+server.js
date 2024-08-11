// src/routes/api/historical-data/[id]/+server.js
import { json } from '@sveltejs/kit';
import { downloadFile } from '$lib/storage';
import { parse } from 'csv-parse/sync';

export async function GET({ params }) {
    try {
        const { id } = params;
        const fileContent = await downloadFile(id);
        const records = parse(fileContent, { columns: true, skip_empty_lines: true });
        return json(records);
    } catch (error) {
        console.error('Error downloading file:', error);
        return json({ error: 'Failed to download file' }, { status: 500 });
    }
}