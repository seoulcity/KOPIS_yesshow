<!-- src/routes/admin/performances/[id]/edit/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { updatePerformance, getUserVenues } from '$lib/api';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';

	let performance = {};
	let venues = [];
	let error = null;
	let thumbnailFile = null;

	onMount(async () => {
		try {
			const performanceId = $page.params.id;
			const { data, error: perfError } = await supabase
				.from('performances')
				.select('*')
				.eq('id', performanceId)
				.single();

			if (perfError) throw perfError;
			performance = data;

			venues = await getUserVenues();
		} catch (err) {
			console.error('Error fetching data:', err);
			error = err.message;
		}
	});

	const handleSubmit = async () => {
		try {
			error = null;
			const updatedPerformance = {
				name: performance.name,
				venue_id: performance.venue_id,
				genre: performance.genre,
				seat_count: parseInt(performance.seat_count),
				min_price: parseFloat(performance.min_price),
				max_price: parseFloat(performance.max_price),
				thumbnail_url: performance.thumbnail_url
			};

			const updatedData = await updatePerformance(
				performance.id,
				updatedPerformance,
				thumbnailFile
			);
			console.log('Updated performance:', updatedData);
			goto('/admin/performances');
		} catch (err) {
			console.error('Error updating performance:', err);
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

<h1 class="text-2xl font-bold mb-4">공연 정보 수정</h1>

{#if error}
	<p class="text-red-500 mb-4">{error}</p>
{/if}

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
	<div>
		<label for="name" class="block mb-2">공연명</label>
		<input id="name" bind:value={performance.name} required class="w-full p-2 border rounded" />
	</div>
	<div>
		<label for="venue" class="block mb-2">공연장</label>
		<select id="venue" bind:value={performance.venue_id} required class="w-full p-2 border rounded">
			{#each venues as venue}
				<option value={venue.id}>{venue.name}</option>
			{/each}
		</select>
	</div>
	<div>
		<label for="genre" class="block mb-2">장르</label>
		<input id="genre" bind:value={performance.genre} required class="w-full p-2 border rounded" />
	</div>
	<div>
		<label for="seat_count" class="block mb-2">좌석 수</label>
		<input
			id="seat_count"
			type="number"
			bind:value={performance.seat_count}
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
			bind:value={performance.min_price}
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
			bind:value={performance.max_price}
			required
			class="w-full p-2 border rounded"
		/>
	</div>
	<div>
		<label for="thumbnail" class="block mb-2">썸네일 이미지</label>
		{#if performance.thumbnail_url}
			<img
				src={performance.thumbnail_url}
				alt="Current thumbnail"
				class="w-32 h-32 object-cover mb-2"
			/>
		{/if}
		<input
			id="thumbnail"
			type="file"
			accept="image/*"
			on:change={handleFileChange}
			class="w-full p-2 border rounded"
		/>
	</div>

	<button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
		공연 정보 수정
	</button>
</form>
