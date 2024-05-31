// src/routes/api/chat/+server.js

import { createOpenAIClient, getGPTResponse } from './openaiClient';
import { handleError } from './errorHandler';

export async function POST({ request }) {
    try {
        const { userInput, apiKey } = await request.json();
        console.log('User input:', userInput);

        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'API key is required' }), { status: 400 });
        }

        const openai = createOpenAIClient(apiKey);
        const reply = await getGPTResponse(openai, userInput);

        console.log('OpenAI response:', reply);

        return new Response(JSON.stringify({ text: reply }), { status: 200 });
    } catch (error) {
        const { status, errorMessage } = handleError(error);
        return new Response(JSON.stringify({ error: errorMessage }), { status });
    }
}
