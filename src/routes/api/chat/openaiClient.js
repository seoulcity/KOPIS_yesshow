// src/routes/api/chat/openaiClient.js

import OpenAI from 'openai';

/**
 * Initializes OpenAI client with provided API key.
 * @param {string} apiKey - The API key for OpenAI.
 * @returns {OpenAI} - The OpenAI client instance.
 */
export function createOpenAIClient(apiKey) {
    return new OpenAI({ apiKey });
}

/**
 * Sends a message to OpenAI and returns the response.
 * @param {OpenAI} client - The OpenAI client instance.
 * @param {string} userInput - The user input to send to OpenAI.
 * @param {string} model - The model to use for the completion.
 * @returns {Promise<string>} - The response from OpenAI.
 */
export async function getGPTResponse(client, userInput, model = 'gpt-3.5-turbo') {
    const response = await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: userInput }],
    });

    return response.choices[0].message.content.trim();
}
