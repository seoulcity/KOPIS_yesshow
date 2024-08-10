<!-- src/routes/login/+page.svelte -->
<script>
	import { supabase } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let isLogin = true;
	let email = '';
	let password = '';
	let confirmPassword = '';
	let passwordMatch = true;
	let errorMessage = '';

	onMount(async () => {
		const { data: { user } } = await supabase.auth.getUser();
		if (user) {
			goto('/');
		}
	});

	const toggleForm = () => {
		isLogin = !isLogin;
		email = '';
		password = '';
		confirmPassword = '';
		passwordMatch = true;
		errorMessage = '';
	};

	const checkPasswordMatch = () => {
		if (!isLogin) {
			passwordMatch = password === confirmPassword;
		}
	};

	const handleSubmit = async () => {
		errorMessage = '';
		if (isLogin) {
			const { error } = await supabase.auth.signInWithPassword({ email, password });
			if (error) {
				if (error.message.includes('Invalid login credentials')) {
					errorMessage = '이메일 주소 또는 비밀번호가 올바르지 않습니다.';
				} else {
					errorMessage = error.message;
				}
			} else {
				goto('/');
			}
		} else {
			if (passwordMatch) {
				const { data, error } = await supabase.auth.signUp({ 
					email, 
					password,
					options: {
						emailRedirectTo: `${window.location.origin}/auth/callback`,
						data: {
							// 여기에 추가 사용자 데이터를 넣을 수 있습니다.
						}
					}
				});
				if (error) {
					if (error.message.includes('Email already registered')) {
						errorMessage = '이미 등록된 이메일 주소입니다.';
					} else {
						errorMessage = error.message;
					}
				} else {
					// 회원가입 성공 후 즉시 로그인
					const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
					if (signInError) {
						errorMessage = signInError.message;
					} else {
						goto('/');
					}
				}
			} else {
				errorMessage = '비밀번호가 일치하지 않습니다.';
			}
		}
	};
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
				{isLogin ? '로그인' : '회원가입'}
			</h2>
		</div>
		<form class="mt-8 space-y-6" on:submit|preventDefault={handleSubmit}>
			<input type="hidden" name="remember" value="true">
			<div class="rounded-md shadow-sm -space-y-px">
				<div>
					<label for="email-address" class="sr-only">이메일 주소</label>
					<input id="email-address" name="email" type="email" bind:value={email} required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="이메일 주소">
				</div>
				<div>
					<label for="password" class="sr-only">비밀번호</label>
					<input id="password" name="password" type="password" bind:value={password} required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="비밀번호">
				</div>
				{#if !isLogin}
					<div>
						<label for="confirm-password" class="sr-only">비밀번호 확인</label>
						<input id="confirm-password" name="confirm-password" type="password" bind:value={confirmPassword} on:input={checkPasswordMatch} required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="비밀번호 확인">
					</div>
				{/if}
			</div>

			{#if errorMessage}
				<div class="rounded-md bg-red-50 p-4">
					<div class="flex">
						<div class="flex-shrink-0">
							<!-- Heroicon name: solid/x-circle -->
							<svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
							</svg>
						</div>
						<div class="ml-3">
							<h3 class="text-sm font-medium text-red-800">
								{errorMessage}
							</h3>
						</div>
					</div>
				</div>
			{/if}

			<div>
				<button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
					<span class="absolute left-0 inset-y-0 flex items-center pl-3">
						<!-- Heroicon name: solid/lock-closed -->
						<svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
						</svg>
					</span>
					{isLogin ? '로그인' : '회원가입'}
				</button>
			</div>
		</form>
		<div class="text-center">
			<button on:click={toggleForm} class="font-medium text-indigo-600 hover:text-indigo-500">
				{isLogin ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
			</button>
		</div>
	</div>
</div>