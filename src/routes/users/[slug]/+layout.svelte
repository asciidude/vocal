<script>
    import LeftSideBar from '$lib/components/shared/LeftSideBar.svelte';
    import RightSideBar from '$lib/components/shared/RightSideBar.svelte';
</script>
  
<div class="flex min-h-screen bg-[#110b13]">
    <LeftSideBar />
    
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>

    <RightSideBar />
</div>
