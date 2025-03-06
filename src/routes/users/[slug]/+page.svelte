<script lang="ts">
    import type { UserType } from "$lib/types/User.types";

    export let data: { user: UserType };
    let user = data.user;
</script>

{#if user}
    <p class="text-white">Raw JSON Data:<br>{JSON.stringify(user)}</p>
    <p class="text-white">User ID: {user._id}</p>
    <p class="text-white">User Name: {user.username}</p>
{/if}