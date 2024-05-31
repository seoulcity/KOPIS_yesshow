<!-- src/routes/+page.svelte -->
<script>
    import { beforeUpdate, afterUpdate } from 'svelte';
    import Chatbox from '../components/Chatbox.svelte';
    import ChatInput from '../components/ChatInput.svelte';
    import Header from '../components/Header.svelte';

    let comments = [];
    const typing = { author: 'gpt', text: '...' };
    let apiKey = '';
    let message = '';
    let errorMessage = '';

    async function handleKeydown(event) {
        if (event.key === 'Enter' && message) {
            await sendMessage();
        }
    }

    async function sendMessage() {
        if (!apiKey) {
            alert('Input your API key');
            return;
        }

        const comment = {
            author: 'user',
            text: message
        };

        message = '';
        comments = [...comments, comment];
        errorMessage = '';

        comments = [...comments, typing];

        const reply = await getGPTResponse(comment.text);

        comments = comments.filter(comment => comment !== typing);

        if (reply.error) {
            errorMessage = reply.error;
        } else {
            comments = [...comments, reply];
        }
    }

    async function getGPTResponse(userInput) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userInput, apiKey }),
            });
            const data = await response.json();
            if (response.ok) {
                return { author: 'gpt', text: data.text };
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Error getting GPT response:', error);
            return { error: error.message };
        }
    }
</script>

<div class="grid place-items-center h-screen bg-gray-100">
    <div class="flex flex-col w-full h-full max-w-md md:max-w-lg border border-gray-900 rounded-xl shadow-lg overflow-hidden">
        <div class="flex flex-col h-full pt-16 pb-4 box-border overflow-hidden">
            <Header />

            <!-- Header Divider -->
            <div class="border-t border-gray-300 mx-4"></div>

            <Chatbox {comments} {errorMessage} />
            
            <!-- Divider -->
            <div class="border-t border-gray-300 my-2 mx-4"></div>
        </div>

        <div class="px-4 py-2 bg-gray-100">
            <label for="api-key" class="block text-sm font-medium text-gray-700">OpenAI API Key</label>
            <input id="api-key" type="password" bind:value={apiKey} class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 w-full" placeholder="Enter your API key" />
        </div>

        <ChatInput bind:message {handleKeydown} {sendMessage} />
    </div>
</div>
