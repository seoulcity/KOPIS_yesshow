<!-- src/routes/+page.svelte -->
<script>
    import Chatbox from '../components/Chatbox.svelte';
    import ChatInput from '../components/ChatInput.svelte';
    import Header from '../components/Header.svelte';
    import Divider from '../components/Divider.svelte';

    let comments = [];
    const typing = { author: 'gpt', text: '...', model: '' }; // Added model property
    let apiKey = '';
    let errorMessage = '';
    let selectedModel = 'gpt-3.5-turbo';
    const models = ['gpt-3.5-turbo', 'gpt-4-turbo', 'gpt-4o'];

    function addComment(comment) {
        comments = [...comments, comment];
        removeTypingIndicator(); // Ensure typing indicator is removed
    }

    function removeTypingIndicator() {
        comments = comments.filter(comment => comment.text !== '...');
    }

    function setError(message) {
        errorMessage = message;
    }

    function handleModelChange(event) {
        selectedModel = event.target.value;
    }
</script>

<div class="grid place-items-center h-screen bg-gray-100">
    <div class="flex flex-col w-full h-full max-w-md md:max-w-lg border border-gray-900 rounded-xl shadow-lg overflow-hidden">
        <div class="flex flex-col h-full pt-16 pb-4 box-border overflow-hidden">
            <Header />
            <Divider />
            <Chatbox {comments} {errorMessage} />
            <Divider />
        </div>

        <div class="px-4 py-2 bg-gray-100">
            <label for="api-key" class="block text-sm font-medium text-gray-700">OpenAI API Key</label>
            <input id="api-key" type="password" bind:value={apiKey} class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 w-full" placeholder="Enter your API key" />
        </div>

        <div class="px-4 py-2 bg-gray-100">
            <label for="model-select" class="block text-sm font-medium text-gray-700">Select Model</label>
            <select id="model-select" bind:value={selectedModel} on:change={handleModelChange} class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 w-full">
                {#each models as model}
                    <option value={model}>{model}</option>
                {/each}
            </select>
        </div>

        <ChatInput {apiKey} {addComment} {removeTypingIndicator} {setError} {typing} {selectedModel} />
    </div>
</div>
