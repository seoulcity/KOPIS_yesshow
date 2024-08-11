<!-- src/routes/admin/performances/new/+page.svelte -->
<script>
	import { createPerformance, getUserVenues } from '$lib/api';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	let name = '';
	let venue_id = '';
	let genre = '';
	let seat_count = 0;
	let min_price = 0;
	let max_price = 0;
	let thumbnailFile = null;
	let error = null;
	let venues = [];
	let currentUser = null;

	onMount(async () => {
		try {
			venues = await getUserVenues();
			const {
				data: { user }
			} = await supabase.auth.getUser();
			currentUser = user;
			console.log('Current user:', currentUser);
		} catch (err) {
			console.error('Error fetching data:', err);
			error = err.message;
		}
	});

	const handleSubmit = async () => {
		try {
			error = null;
			const performanceData = {
				name,
				venue_id,
				genre,
				seat_count: parseInt(seat_count),
				min_price: parseFloat(min_price),
				max_price: parseFloat(max_price)
			};

			console.log('Submitting performance data:', performanceData);

			const newPerformance = await createPerformance(performanceData, thumbnailFile);

			console.log('API response:', newPerformance);

			goto('/admin/performances');
		} catch (err) {
			console.error('Error creating performance:', err);
			error = err.message;
		}
	};

	function handleFileChange(event) {
		const file = event.target.files[0];
		if (file) {
			thumbnailFile = file;
		}
	}
</script>

<h1 class="text-2xl font-bold mb-4">새 공연 추가</h1>

{#if error}
	<pre class="text-red-500 mb-4 whitespace-pre-wrap">{error}</pre>
{/if}

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
	<div>
		<label for="name" class="block mb-2">공연명</label>
		<input id="name" bind:value={name} required class="w-full p-2 border rounded" />
	</div>
	<div>
		<label for="venue" class="block mb-2">공연장</label>
		<select id="venue" bind:value={venue_id} required class="w-full p-2 border rounded">
			<option value="">공연장을 선택하세요</option>
			{#each venues as venue}
				<option value={venue.id}>{venue.name}</option>
			{/each}
		</select>
	</div>
	<div>
		<label for="genre" class="block mb-2">장르</label>
		<input id="genre" bind:value={genre} required class="w-full p-2 border rounded" />
	</div>
	<div>
		<label for="seat_count" class="block mb-2">좌석 수</label>
		<input
			id="seat_count"
			type="number"
			bind:value={seat_count}
			required
			class="w-full p-2 border rounded"
		/>
	</div>
	<div>
		<label for="min_price" class="block mb-2">최저 가격</label>
		<input
			id="min_price"
			type="number"
			step="0.01"
			bind:value={min_price}
			required
			class="w-full p-2 border rounded"
		/>
	</div>
	<div>
		<label for="max_price" class="block mb-2">최고 가격</label>
		<input
			id="max_price"
			type="number"
			step="0.01"
			bind:value={max_price}
			required
			class="w-full p-2 border rounded"
		/>
	</div>
	<div>
		<label for="thumbnail" class="block mb-2">썸네일 이미지</label>
		<input
			id="thumbnail"
			type="file"
			accept="image/*"
			on:change={handleFileChange}
			class="w-full p-2 border rounded"
		/>
	</div>
	<button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
		공연 정보 저장
	</button>
</form>

<pre class="mt-4">
  Current User: {JSON.stringify(currentUser, null, 2)}
  Venues: {JSON.stringify(venues, null, 2)}
  </pre>
