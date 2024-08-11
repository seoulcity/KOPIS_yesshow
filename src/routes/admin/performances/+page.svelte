<script>
    import { onMount } from 'svelte';
    import { getUserPerformances, deletePerformance } from '$lib/api';
    import { goto } from '$app/navigation';
  
    let performances = [];
    let error = null;
  
    onMount(async () => {
      try {
        performances = await getUserPerformances();
      } catch (err) {
        console.error('Error fetching performances:', err);
        error = err.message;
      }
    });
  
    function addNewPerformance() {
      goto('/admin/performances/new');
    }
  
    async function handleDelete(id) {
      if (confirm('이 공연을 삭제하시겠습니까?')) {
        try {
          await deletePerformance(id);
          performances = performances.filter(p => p.id !== id);
        } catch (err) {
          console.error('Error deleting performance:', err);
          error = err.message;
        }
      }
    }
  
    function editPerformance(id) {
      goto(`/admin/performances/${id}/edit`);
    }
  </script>
  
  <h1 class="text-2xl font-bold mb-4">공연 관리</h1>
  
  {#if error}
    <p class="text-red-500 mb-4">{error}</p>
  {/if}
  
  <button on:click={addNewPerformance} class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mb-4">
    새 공연 추가
  </button>
  
  {#if performances.length === 0}
    <p>등록된 공연이 없습니다.</p>
  {:else}
    <div class="grid gap-4">
      {#each performances as performance}
        <div class="border p-4 rounded">
          <h2 class="text-xl font-bold">{performance.name}</h2>
          <p>공연장: {performance.venues.name}</p>
          <p>장르: {performance.genre}</p>
          <p>좌석 수: {performance.seat_count}</p>
          <p>가격: {performance.min_price} - {performance.max_price}</p>
          <button on:click={() => editPerformance(performance.id)} class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 mr-2">
            수정
          </button>
          <button on:click={() => handleDelete(performance.id)} class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700">
            삭제
          </button>
        </div>
      {/each}
    </div>
  {/if}