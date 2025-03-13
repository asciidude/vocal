<script lang="ts">
    import { page } from '$app/state';
    export let status: number;
    export let message: string;
</script>

<title>Vocal - {page.status}</title>

<main>
    <div class="h-screen flex flex-col items-center justify-center text-center text-white w-96 mx-auto">
        <img src="https://http.cat/{status || page.status}" alt="{status || page.status} ({message || page.error?.message})" class="max-[384px]:h-40">
        <p class="mt-5 text-sm italic text-vocal_light underline"><a href="/">Back home</a></p>
    </div>
</main>