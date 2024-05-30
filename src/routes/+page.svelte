<!-- src/routes/+page.svelte -->
<script>
    import { beforeUpdate, afterUpdate } from 'svelte';

    let div;
    let autoscroll = false;
    let comments = [];
    const typing = { author: 'gpt', text: '...' };
    let apiKey = '';
    let message = '';
    let errorMessage = '';

    const pause = (ms) => new Promise((fulfil) => setTimeout(fulfil, ms));

    beforeUpdate(() => {
        if (div) {
            const scrollableDistance = div.scrollHeight - div.offsetHeight;
            autoscroll = div.scrollTop > scrollableDistance - 20;
        }
    });

    afterUpdate(() => {
        if (autoscroll) {
            div.scrollTo(0, div.scrollHeight);
        }
    });

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

        await pause(200 * (1 + Math.random()));
        comments = [...comments, typing];

        const reply = await getGPTResponse(comment.text);

        comments = [...comments.filter(comment => comment !== typing)];

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

<div class="grid place-items-center h-screen">
    <div class="flex flex-col w-full h-full max-w-md md:max-w-lg bg-white border border-gray-900 rounded-xl shadow-lg overflow-hidden">
        <div class="flex flex-col h-full pt-16 pb-4 box-border overflow-hidden">
            <header class="flex flex-col items-center justify-center">
                <h1 class="flex-1 text-center text-xl">Key-Provided GPT Basic Chatbot</h1>
            </header>

            <div class="flex-1 overflow-y-auto px-4 py-2 space-y-2" bind:this={div}>
                {#if errorMessage}
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong class="font-bold">Error:</strong>
                        <span class="block sm:inline">{errorMessage}</span>
                    </div>
                {/if}
                {#each comments as comment}
                    <article class="flex {comment.author === 'user' ? 'justify-end' : 'justify-start'}">
                        <span class="{comment.author === 'user' ? 'bg-blue-600 text-white rounded-xl ml-16' : 'bg-gray-100 text-gray-800 rounded-xl mr-16'} px-4 py-2 break-words">{comment.text}</span>
                    </article>
                {/each}
            </div>
        </div>

        <div class="px-4 py-2">
            <label for="api-key" class="block text-sm font-medium text-gray-700">OpenAI API Key</label>
            <input id="api-key" type="password" bind:value={apiKey} class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 w-full" placeholder="Enter your API key" />
        </div>

        <div class="flex items-center mt-2 mb-4 mx-4">
            <input
                class="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                bind:value={message}
                on:keydown={handleKeydown}
                placeholder="Type your message and press Enter"
            />
            <button
                class="ml-2 p-2 text-white rounded-md"
                on:click={sendMessage}
                class:bg-blue-600={message !== ''}
                class:bg-gray-400={message === ''}
                disabled={!message}
            >
                ↵
            </button>
        </div>
    </div>
</div>
