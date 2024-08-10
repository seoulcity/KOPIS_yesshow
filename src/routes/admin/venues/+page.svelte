<!-- src/routes/admin/venues/+page.svelte -->
<script>
    import { supabase } from '$lib/supabaseClient';
    
    let venueName = '';
    let businessNumber = '';
    let address = '';
    let phoneNumber = '';
    let managerName = '';
    let managerPhone = '';
    let managerEmail = '';
  
    const handleSubmit = async () => {
      const { data, error } = await supabase
        .from('venues')
        .insert([
          { 
            name: venueName, 
            business_number: businessNumber,
            address,
            phone_number: phoneNumber,
            manager_name: managerName,
            manager_phone: managerPhone,
            manager_email: managerEmail
          }
        ]);
  
      if (error) {
        console.error('Error adding venue:', error);
      } else {
        console.log('Venue added successfully:', data);
        // Reset form or show success message
      }
    };
  </script>
  
  <h1 class="text-2xl font-bold mb-4">공연장 정보 입력</h1>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="venueName" class="block mb-2">공연장명</label>
      <input id="venueName" bind:value={venueName} required class="w-full p-2 border rounded">
    </div>
    <div>
      <label for="businessNumber" class="block mb-2">사업자등록번호</label>
      <input id="businessNumber" bind:value={businessNumber} required class="w-full p-2 border rounded">
    </div>
    <div>
      <label for="address" class="block mb-2">주소</label>
      <input id="address" bind:value={address} required class="w-full p-2 border rounded">
    </div>
    <div>
      <label for="phoneNumber" class="block mb-2">전화번호</label>
      <input id="phoneNumber" bind:value={phoneNumber} required class="w-full p-2 border rounded">
    </div>
    <div>
      <label for="managerName" class="block mb-2">담당자명</label>
      <input id="managerName" bind:value={managerName} required class="w-full p-2 border rounded">
    </div>
    <div>
      <label for="managerPhone" class="block mb-2">담당자 전화번호</label>
      <input id="managerPhone" bind:value={managerPhone} required class="w-full p-2 border rounded">
    </div>
    <div>
      <label for="managerEmail" class="block mb-2">담당자 이메일</label>
      <input id="managerEmail" bind:value={managerEmail} required type="email" class="w-full p-2 border rounded">
    </div>
    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
      공연장 정보 저장
    </button>
  </form>