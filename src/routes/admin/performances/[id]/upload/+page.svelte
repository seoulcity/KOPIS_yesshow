<script>
    import { page } from '$app/stores';
    import { supabase } from '$lib/supabaseClient';
    import Papa from 'papaparse';
  
    let file;
    let uploading = false;
    let progress = 0;
    let error = null;
    let success = false;
  
    const performanceId = $page.params.id;
  
    async function handleUpload() {
      if (!file) {
        error = '파일을 선택해주세요.';
        return;
      }
  
      uploading = true;
      error = null;
      success = false;
  
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csv = e.target.result;
        const { data, errors } = Papa.parse(csv, { header: true });
  
        if (errors.length > 0) {
          error = '올바르지 않은 CSV 형식입니다.';
          uploading = false;
          return;
        }
  
        try {
          for (let i = 0; i < data.length; i++) {
            const row = data[i];
            row.performance_id = performanceId;
            row.is_training_data = true;
  
            const { error: uploadError } = await supabase
              .from('prediction_data')
              .insert(row);
  
            if (uploadError) throw uploadError;
  
            progress = Math.round(((i + 1) / data.length) * 100);
          }
  
          success = true;
        } catch (err) {
          error = '데이터 업로드 중 오류가 발생했습니다: ' + err.message;
        } finally {
          uploading = false;
        }
      };
  
      reader.readAsText(file);
    }
  </script>
  
  <h1 class="text-2xl font-bold mb-4">기 공연 데이터 업로드</h1>
  
  <div class="mb-4">
    <input type="file" accept=".csv" bind:files={file} disabled={uploading} />
  </div>
  
  <button
    on:click={handleUpload}
    disabled={uploading || !file}
    class="bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
  >
    {uploading ? '업로드 중...' : '업로드'}
  </button>
  
  {#if uploading}
    <div class="mt-4">
      <progress value={progress} max="100"></progress>
      <p>{progress}% 완료</p>
    </div>
  {/if}
  
  {#if error}
    <p class="text-red-500 mt-4">{error}</p>
  {/if}
  
  {#if success}
    <p class="text-green-500 mt-4">데이터 업로드가 완료되었습니다.</p>
  {/if}