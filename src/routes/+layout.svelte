<script lang="ts">
    import { Toaster } from "$lib/components/ui/sonner/index.js";

    let { children } = $props();
    import '../app.css';
</script>

<Toaster />

{@render children()}