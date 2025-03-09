<script>
    import LeftSideBar from '$lib/components/shared/LeftSideBar.svelte';
    import RightSideBar from '$lib/components/shared/RightSideBar.svelte';
</script>
  
<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
    <style>
      @font-face {
        font-family: 'Minecraft';
        src: url('https://cdnjs.cloudflare.com/ajax/libs/minecraft-font/1.0.0/minecraft.ttf') format('truetype');
      }
      
      body {
        font-family: 'Press Start 2P', 'VT323', 'Minecraft', monospace;
        image-rendering: pixelated;
      }
    </style>
</svelte:head>
  
<div class="flex min-h-screen bg-[#1a1a1a]">
    <LeftSideBar />
    
    <main class="flex-1 overflow-y-auto">
      <slot />
    </main>

    <RightSideBar />
</div>
