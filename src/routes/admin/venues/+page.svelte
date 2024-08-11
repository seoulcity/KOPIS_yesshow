<!-- src/routes/admin/venues/+page.svelte -->
<script>
    import { onMount } from 'svelte';
    import { getUserVenues } from '$lib/api';
    import { goto } from '$app/navigation';
  
    let venues = [];
    let error = null;
  
    onMount(async () => {
      try {
        venues = await getUserVenues();
      } catch (err) {
        console.error('Error fetching venues:', err);
        error = err.message;
      }
    });
  
    function addNewVenue() {
      goto('/admin/venues/new');
    }
  </script>
  
  <h1 class="text-2xl font-bold mb-4">공연장 관리</h1>
  
  {#if error}
    <p class="text-red-500 mb-4">{error}</p>
  {/if}
  
  <button on:click={addNewVenue} class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mb-4">
    새 공연장 추가
  </button>
  
  {#if venues.length === 0}
    <p>등록된 공연장이 없습니다.</p>
  {:else}
    <div class="grid gap-4">
      {#each venues as venue}
        <div class="border p-4 rounded">
          <h2 class="text-xl font-bold">{venue.name}</h2>
          <p>사업자등록번호: {venue.business_number}</p>
          <p>주소: {venue.address}</p>
          <p>전화번호: {venue.phone_number}</p>
          <p>담당자: {venue.manager_name}</p>
          <p>담당자 연락처: {venue.manager_phone}</p>
          <p>담당자 이메일: {venue.manager_email}</p>
        </div>
      {/each}
    </div>
  {/if}