<script lang="ts">
    import LeftSideBar from '$lib/components/shared/LeftSideBar.svelte';
    import type { UserType } from 'src/lib/types/User.types';
    export let data: { user: UserType | null };
</script>
  
<div class="flex min-h-screen bg-[#110b13]">
    
    <LeftSideBar user={data.user} />
    
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>
</div>
