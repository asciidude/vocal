<script lang="ts">
    export let size = "10";
    export let color = "vocal_medium";
    export let bgColor = "vocal_darkest";
</script>
  
<div class="flex justify-center items-center h-screen {`bg-${bgColor}`}">
    <div class="{`w-${size} h-${size} border-4 border-${color} border-t-transparent rounded-full animate-spin`}"></div>
</div>
