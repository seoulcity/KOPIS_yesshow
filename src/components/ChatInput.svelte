<!-- src/components/ChatInput.svelte -->
<script>
    export let message;
    export let handleKeydown;
    export let sendMessage;
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
