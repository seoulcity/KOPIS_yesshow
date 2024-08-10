<!-- src/routes/+page.svelte -->
<script>
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
    import Chatbox from '../components/Chatbox.svelte';
    import ChatInput from '../components/ChatInput.svelte';
    import Header from '../components/Header.svelte';
    import Divider from '../components/Divider.svelte';

    let user = null;
    let comments = [];
    const typing = { author: 'gpt', text: '...', model: '' };
    let apiKey = '';
    let errorMessage = '';
    let selectedModel = 'gpt-3.5-turbo';
    const models = ['gpt-3.5-turbo', 'gpt-4-turbo', 'gpt-4o'];

    onMount(async () => {
		const { data: { user: currentUser } } = await supabase.auth.getUser();
		if (currentUser) {
			user = currentUser;
		} else {
			goto('/login');
		}
	});

    const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (!error) {
			goto('/login');
		}
	};

    function addComment(comment) {
        comments = [...comments, comment];
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

<nav class="bg-gray-800 p-4">
	<div class="container mx-auto flex justify-between items-center">
		<h1 class="text-white text-xl font-bold">YesShow</h1>
		{#if user}
			<button on:click={handleLogout} class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
				로그아웃
			</button>
		{/if}
	</div>
</nav>

<div class="flex h-screen bg-gray-100">
    <!-- 왼쪽: 새로운 컨텐츠 영역 -->
    <div class="w-1/2 p-4 overflow-auto">
        <h2 class="text-2xl font-bold mb-4">환영합니다, {user?.email}!</h2>
        <!-- 여기에 새로운 컨텐츠 컴포넌트를 추가하세요 -->
    </div>

    <!-- 오른쪽: 채팅 영역 -->
    <div class="w-1/2 flex flex-col border-l border-gray-300">
        <div class="flex flex-col h-full overflow-hidden">
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