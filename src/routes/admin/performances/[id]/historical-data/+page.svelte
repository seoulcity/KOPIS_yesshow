<!-- src/routes/admin/performances/[id]/historical-data/+page.svelte -->
<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { supabase } from '$lib/supabaseClient';
    import { uploadHistoricalData, getHistoricalData, getHistoricalDataContent, deleteHistoricalData } from '$lib/api';

	let performanceId = $page.params.id;
	let performance = null;
	let file = null;
	let uploading = false;
	let error = null;
	let historicalData = [];
	let selectedData = null;
	let dataContent = null;
    let currentPage = 1;
    let itemsPerPage = 20;
    let totalPages = 0;
    let isLoading = false;

	onMount(async () => {
		const { data, error: perfError } = await supabase
			.from('performances')
			.select('*')
			.eq('id', performanceId)
			.single();

		if (perfError) {
			error = perfError.message;
		} else {
			performance = data;
			loadHistoricalData();
		}
	});

	async function loadHistoricalData() {
		historicalData = await getHistoricalData(performanceId);
	}

	async function handleUpload() {
        if (!file || !file[0]) {
            error = '파일을 선택해주세요.';
            return;
        }

        uploading = true;
        error = null;

        try {
            await uploadHistoricalData(performanceId, file[0]);
            await loadHistoricalData();
            file = null;
        } catch (e) {
            console.error('Upload error:', e);
            error = e.message;
        } finally {
            uploading = false;
        }
    }

    async function handleDelete(id) {
		if (confirm('정말로 이 데이터를 삭제하시겠습니까?')) {
			try {
				await deleteHistoricalData(id);
				await loadHistoricalData();
			} catch (error) {
				console.error('Error deleting data:', error);
				// 에러 처리 로직 추가
			}
		}
	}

	async function viewDataContent(data) {
        try {
            selectedData = data;
            isLoading = true;
            const content = await getHistoricalDataContent(data.file_url);
            dataContent = content;
            totalPages = Math.ceil(content.length / itemsPerPage);
            currentPage = 1;
        } catch (error) {
            console.error('Error viewing data content:', error);
            // 에러 처리 로직 추가
        } finally {
            isLoading = false;
        }
    }

    $: paginatedContent = dataContent ? dataContent.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

    function nextPage() {
        if (currentPage < totalPages) currentPage++;
    }

    function prevPage() {
        if (currentPage > 1) currentPage--;
    }
</script>

<h1 class="text-2xl font-bold mb-4">기 공연 데이터 관리 - {performance?.name}</h1>

{#if error}
	<p class="text-red-500 mb-4">{error}</p>
{/if}

<div class="mb-6 p-4 bg-gray-100 rounded">
	<h2 class="text-xl font-bold mb-2">데이터 업로드</h2>
	<input type="file" accept=".csv" bind:files={file} disabled={uploading} class="mb-2" />
	<button
		on:click={handleUpload}
		disabled={uploading || !file}
		class="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300 hover:bg-blue-700"
	>
		{uploading ? '업로드 중...' : '업로드'}
	</button>
</div>

<h2 class="text-xl font-bold mb-2">업로드된 데이터</h2>
{#if historicalData.length === 0}
	<p>업로드된 데이터가 없습니다.</p>
{:else}
<table class="w-full border-collapse border border-gray-300">
	<thead>
		<tr class="bg-gray-100">
			<th class="border border-gray-300 px-4 py-2">파일명</th>
			<th class="border border-gray-300 px-4 py-2">업로드 일시</th>
			<th class="border border-gray-300 px-4 py-2">동작</th>
		</tr>
	</thead>
	<tbody>
		{#each historicalData as data}
			<tr>
				<td class="border border-gray-300 px-4 py-2">{data.filename || '파일명 없음'}</td>
				<td class="border border-gray-300 px-4 py-2"
					>{new Date(data.created_at).toLocaleString()}</td
				>
				<td class="border border-gray-300 px-4 py-2">
					<button
						on:click={() => viewDataContent(data)}
						class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700 mr-2"
					>
						내용 보기
					</button>
					<button
						on:click={() => handleDelete(data.id)}
						class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
					>
						삭제
					</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
{/if}

{#if selectedData && dataContent}
    <div class="mt-6">
        <h3 class="text-lg font-bold mb-2">{selectedData.filename} 내용</h3>
        {#if isLoading}
            <p>데이터를 불러오는 중...</p>
        {:else}
            <div class="overflow-x-auto">
                <table class="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr class="bg-gray-100">
                            {#each Object.keys(dataContent[0] || {}) as header}
                                <th class="border border-gray-300 px-4 py-2">{header}</th>
                            {/each}
                        </tr>
                    </thead>
                    <tbody>
                        {#each paginatedContent as row}
                            <tr>
                                {#each Object.values(row) as cell}
                                    <td class="border border-gray-300 px-4 py-2">{cell}</td>
                                {/each}
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
            <div class="mt-4 flex justify-between items-center">
                <button on:click={prevPage} disabled={currentPage === 1} class="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300">
                    이전
                </button>
                <span>페이지 {currentPage} / {totalPages}</span>
                <button on:click={nextPage} disabled={currentPage === totalPages} class="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300">
                    다음
                </button>
            </div>
        {/if}
    </div>
{/if}