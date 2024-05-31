<!-- src/components/ChatInput.svelte -->
<script>
    export let apiKey;
    export let addComment;
    export let removeTypingIndicator;
    export let setError;
    export let typing;
    export let selectedModel;

    let message = '';

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
        addComment(comment);
        setError('');

        const typingComment = { ...typing, text: '...', model: selectedModel };
        addComment(typingComment);

        const reply = await getGPTResponse(comment.text);

        removeTypingIndicator();

        if (reply.error) {
            setError(reply.error);
        } else {
            reply.model = selectedModel;
            addComment(reply);
        }
    }

    async function getGPTResponse(userInput) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userInput, apiKey, selectedModel }),  // selectedModel 추가
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

<div class="flex items-center mt-2 mb-4 mx-4 bg-gray-100">
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
