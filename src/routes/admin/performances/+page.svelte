<script>
	import { onMount } from 'svelte';
	import {
		getPerformancesByVenueId,
		createPerformance,
		updatePerformance,
		deletePerformance
	} from '$lib/api';
	import { supabase } from '$lib/supabaseClient';

	let performances = [];
	let venueId = '';
	let newPerformance = {
		name: '',
		genre: '',
		seat_count: 0,
		min_price: 0,
		max_price: 0
	};
	let editingPerformance = null;

	onMount(async () => {
		const {
			data: { user }
		} = await supabase.auth.getUser();
		if (user) {
			const { data: venues } = await supabase
				.from('venues')
				.select('id')
				.eq('user_id', user.id)
				.single();

			if (venues) {
				venueId = venues.id;
				loadPerformances();
			}
		}
	});

	async function loadPerformances() {
		performances = await getPerformancesByVenueId(venueId);
	}

	async function handleSubmit() {
		if (editingPerformance) {
			await updatePerformance(editingPerformance.id, { ...newPerformance, venue_id: venueId });
		} else {
			await createPerformance({ ...newPerformance, venue_id: venueId });
		}
		newPerformance = { name: '', genre: '', seat_count: 0, min_price: 0, max_price: 0 };
		editingPerformance = null;
		await loadPerformances();
	}

	function startEdit(performance) {
		editingPerformance = performance;
		newPerformance = { ...performance };
	}

	async function handleDelete(id) {
		if (confirm('Are you sure you want to delete this performance?')) {
			await deletePerformance(id);
			await loadPerformances();
		}
	}
</script>

<h1 class="text-2xl font-bold mb-4">공연 관리</h1>

<form on:submit|preventDefault={handleSubmit} class="mb-8">
	<input
		bind:value={newPerformance.name}
		placeholder="공연명"
		required
		class="mb-2 p-2 border rounded w-full"
	/>
	<input
		bind:value={newPerformance.genre}
		placeholder="장르"
		required
		class="mb-2 p-2 border rounded w-full"
	/>
	<input
		type="number"
		bind:value={newPerformance.seat_count}
		placeholder="좌석 수"
		required
		class="mb-2 p-2 border rounded w-full"
	/>
	<input
		type="number"
		bind:value={newPerformance.min_price}
		placeholder="최저 가격"
		required
		class="mb-2 p-2 border rounded w-full"
	/>
	<input
		type="number"
		bind:value={newPerformance.max_price}
		placeholder="최고 가격"
		required
		class="mb-2 p-2 border rounded w-full"
	/>
	<button type="submit" class="bg-blue-500 text-white p-2 rounded">
		{editingPerformance ? '수정' : '추가'}
	</button>
</form>

<div class="grid gap-4">
	{#each performances as performance}
		<div class="border p-4 rounded">
			<h2 class="text-xl font-bold">{performance.name}</h2>
			<p>장르: {performance.genre}</p>
			<p>좌석 수: {performance.seat_count}</p>
			<p>가격: {performance.min_price} - {performance.max_price}</p>
			<button
				on:click={() => startEdit(performance)}
				class="bg-yellow-500 text-white p-2 rounded mr-2">수정</button
			>
			<button
				on:click={() => handleDelete(performance.id)}
				class="bg-red-500 text-white p-2 rounded mr-2">삭제</button
			>
			<a
				href="/admin/performances/{performance.id}/upload"
				class="bg-green-500 text-white p-2 rounded inline-block">데이터 업로드</a
			>
		</div>
	{/each}
</div>
