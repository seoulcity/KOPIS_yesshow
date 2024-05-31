<!-- src/routes/+page.svelte -->
<script>
    import Chatbox from '../components/Chatbox.svelte';
    import ChatInput from '../components/ChatInput.svelte';
    import Header from '../components/Header.svelte';

    let comments = [];
    const typing = { author: 'gpt', text: '...' };
    let apiKey = '';
    let errorMessage = '';

    function addComment(comment) {
        comments = [...comments, comment];
    }

    function removeTypingIndicator() {
        comments = comments.filter(comment => comment !== typing);
    }

    function setError(message) {
        errorMessage = message;
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

        <ChatInput {apiKey} {addComment} {removeTypingIndicator} {setError} {typing} />
    </div>
</div>
