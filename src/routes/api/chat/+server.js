// src/routes/api/chat/+server.js
import OpenAI from 'openai';

export async function POST({ request }) {
    try {
        const { userInput, apiKey } = await request.json();
        console.log('User input:', userInput);

        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'API key is required' }), { status: 400 });
        }

        const openai = new OpenAI({ apiKey });

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userInput }],
        });

        console.log('OpenAI response:', response);

        const reply = response.choices[0].message.content.trim();
        return new Response(JSON.stringify({ text: reply }), { status: 200 });
    } catch (error) {
        console.error('Error in POST /api/chat:', error);
        let errorMessage = 'Error getting GPT response';

        let status = 500;
        if (error.response && error.response.status) {
            status = error.response.status;
            errorMessage = `Status: ${status}, Message: ${error.response.data.error.message}`;
        } else {
            errorMessage = `Error: ${error.message}`;
        }

        return new Response(JSON.stringify({ error: errorMessage }), { status });
    }
}
