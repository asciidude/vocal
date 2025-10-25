<script lang="ts">
    import LeftSideBar from '$lib/components/shared/LeftSideBar.svelte';
    export let data: { user: typeof user | null };
</script>
  
<div class="flex min-h-screen bg-[#110b13]">
    
    <LeftSideBar user={data.user} />
    
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>
</div>
