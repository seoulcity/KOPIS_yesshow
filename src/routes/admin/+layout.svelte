<!-- src/routes/admin/+layout.svelte -->
<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';

	let user;
	let userRole = null;
	let loading = true;

	onMount(async () => {
		const {
			data: { user: currentUser }
		} = await supabase.auth.getUser();
		if (currentUser) {
			const { data, error } = await supabase
				.from('profiles')
				.select('role')
				.eq('id', currentUser.id)
				.single();

			if (error) {
				console.error('Error fetching user role:', error);
			} else {
				userRole = data.role;
			}
			user = currentUser;
		}
		loading = false;
	});

	$: canAccessAdmin = userRole === 'admin' || userRole === 'venue';
</script>

{#if loading}
	<p>Loading...</p>
{:else if !user}
	<script>
		goto('/login');
	</script>
{:else if !canAccessAdmin}
	<div class="min-h-screen flex items-center justify-center bg-gray-100">
		<div class="max-w-md w-full space-y-8 p-10 bg-white shadow rounded-lg">
			<div class="text-center">
				<h2 class="mt-6 text-3xl font-extrabold text-gray-900">접근 권한 없음</h2>
				<p class="mt-2 text-sm text-gray-600">
					관리자 또는 공연장 권한이 없습니다. 아래 이메일로 문의하세요.
				</p>
				<p class="mt-5 text-lg font-medium text-indigo-600">lallacri86@gmail.com</p>
			</div>
			<div class="mt-5">
				<button
					on:click={() => goto('/')}
					class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>
					메인 페이지로 돌아가기
				</button>
			</div>
		</div>
	</div>
{:else}
	<nav class="bg-gray-800 text-white p-4">
		<div class="container mx-auto flex justify-between items-center">
			<span class="text-xl font-bold">관리자 페이지</span>
			<a href="/admin/venues" class="hover:underline">공연장 관리</a>
			<a href="/admin/performances" class="hover:underline">공연 관리</a>
			<button
				on:click={() => supabase.auth.signOut()}
				class="bg-red-500 hover:bg-red-700 px-4 py-2 rounded"
			>
				로그아웃
			</button>
		</div>
	</nav>

	<main class="container mx-auto mt-8">
		<slot></slot>
	</main>
{/if}
