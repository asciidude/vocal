<script lang="ts">
    import type { UserModelType } from "$lib/types/User.types";
    import type { PageServerData } from "./$types";

    export let data: { user: UserModelType };
    let user = data.user;
</script>

{#if user}
    <p class="text-white">User ID: {user._id}</p>
    <p class="text-white">User Name: {user.username}</p>
{/if}