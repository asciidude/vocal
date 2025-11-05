<script lang="ts">
    import type { PostType } from "$lib/types/Post.type";
    import type { UserType } from "$lib/types/User.types";
    import type { AttachmentType } from "$lib/types/Attachment.type";

    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as Avatar from "$lib/components/ui/avatar";
    import { Ellipsis, Heart, MessageCircle } from "lucide-svelte";

    import { getImage } from "$lib/utils/Cache.util";
    import { enhance } from '$app/forms';

    function getInitials(name: string | undefined) {
        if (!name) return "?";
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    }

    export let post: PostType | null = null;
    export let postAuthor: UserType | null = null;
    export let user: UserType | null = null;
    export let postLikes: Number = 0;
    export let postReplies: Number = 0;
    let screenWidth = 0;

    $: avatarSrc = '';

    $: if (postAuthor) {
        (async () => {
            avatarSrc = await getImage(postAuthor.avatarUrl);
        })();
    }

    function deletePost() {
        return async ({ result }) => {
            if (result.status === 200) {
                document.getElementById(`post-${post!._id}`)?.classList.add('hidden');
            }
        }
    }

    $: screenSmaller = screenWidth <= 713;
</script>

<svelte:window bind:innerWidth={screenWidth} />

<div class="post text-white" id="post-{post?._id}">
    <div class="post-header">
        {#if post}
            <div class="left-section">
                <a href="/users/{postAuthor?.discordId}" class="flex items-center gap-2">
                    <Avatar.Root>
                        <Avatar.Image src={avatarSrc} alt="@{postAuthor?.username}" />
                        <Avatar.Fallback
                            >{getInitials(
                                postAuthor?.displayName || postAuthor?.username,
                            )}</Avatar.Fallback
                        >
                    </Avatar.Root>
                    <div class="username">
                        <p class="leading-none text-2xl">
                            {postAuthor?.displayName || postAuthor?.username}
                        </p>
                        <p class="text-gray-400 text-md">
                            @{postAuthor?.username}
                        </p>
                    </div>
                </a>
        </div>
        {/if}

        {#if post}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger><Ellipsis class="size-5" /></DropdownMenu.Trigger>
                <DropdownMenu.Content class="text-white !bg-vocal_darkest border border-[#9072d7]">
                    <DropdownMenu.Group>
                        {#if user?._id === postAuthor!._id}
                            <form
                                action="/api/posts/delete/{post._id}" method="post"
                                use:enhance={deletePost}
                                id="deletePost-{post._id}"
                            >
                                <input type="hidden" name="postType" value="post">
                                <input type="hidden" name="posterId" value={postAuthor!._id}>
                            </form>

                            <DropdownMenu.Item class="cursor-pointer font-light text-xl">
                                <button
                                    on:click={() => (document.getElementById(`deletePost-${post._id}`) as HTMLFormElement)?.requestSubmit()}
                                    type="submit"
                                >
                                    <span class="text-xl">Delete</span>
                                </button>
                            </DropdownMenu.Item>
                        {/if}
                        <DropdownMenu.Item class="text-red-400 cursor-pointer text-xl font-light">Report</DropdownMenu.Item>
                    </DropdownMenu.Group>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        {/if}
    </div>
    <div class="post-content text-2xl">
        {#if post}
    <p>{post.content}</p>

    {#if post.attachments.length > 0}
        <div class="flex flex-wrap gap-2">
            {#if post.attachments.length === 1}
                <img
                    src={post.attachments[0].url}
                    alt={post.attachments[0].name}
                    class="w-full max-w-[500px] rounded object-cover cursor-pointer hover:brightness-90 transition"
                />
            {:else if post.attachments.length === 2}
                {#each post.attachments as attachment}
                    <img
                        src={attachment.url}
                        alt={attachment.name}
                        class="w-1/2 max-w-[240px] rounded object-cover cursor-pointer hover:brightness-90 transition"
                    />
                {/each}
            {:else if post.attachments.length === 3}
                {#if screenSmaller}
                    <!-- Small screens: stacked Discord-style layout -->
                    <div class="flex gap-2 mb-2">
                        {#each post.attachments.slice(0,2) as attachment}
                            <img
                                src={attachment.url}
                                alt={attachment.name}
                                class="w-1/2 max-w-[240px] aspect-square rounded object-cover cursor-pointer hover:brightness-90 transition"
                            />
                        {/each}
                    </div>
                    <img
                        src={post.attachments[2].url}
                        alt={post.attachments[2].name}
                        class="w-full max-w-[500px] rounded object-cover cursor-pointer hover:brightness-90 transition"
                    />
                {:else}
                    <!-- Large screens: 3 images side by side -->
                    <div class="flex gap-2">
                        {#each post.attachments as attachment}
                            <img
                                src={attachment.url}
                                alt={attachment.name}
                                class="w-1/3 max-w-[240px] aspect-square rounded object-cover cursor-pointer hover:brightness-90 transition"
                            />
                        {/each}
                    </div>
                {/if}
            {:else if post.attachments.length >= 4}
                <div class="grid grid-cols-2 gap-2">
                    {#each post.attachments.slice(0,4) as attachment, i}
                        <div class="relative">
                            <img
                                src={attachment.url}
                                alt={attachment.name}
                                class="w-full h-32 max-w-[240px] object-cover rounded cursor-pointer hover:brightness-90 transition"
                            />
                            {#if i === 3 && post.attachments.length > 4}
                                <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold rounded">
                                    +{post.attachments.length - 4}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {/if}

{:else}
    <p class="italic text-gray-600">This post has been deleted.</p>
{/if}

    </div>
    <div class="post-bottom flex items-center gap-5 mt-2">
        <a class="flex items-center gap-2 mt-2" href="/posts/{post?._id}">
            <MessageCircle class="size-4" />
            <p class="size-6 text-lg">
                {postReplies}
            </p>
        </a>
        <a class="flex items-center gap-2 mt-2" href="/api/like/{post?._id}">
            <Heart class="size-4" />
            <p class="size-6 text-lg">
                {postLikes}
            </p>
        </a>
    </div>
</div>


<style>
    .post {
        background-color: rgb(19, 15, 27);
        border-radius: 8px;
        padding: 1.25rem;
        border: 1px solid rgb(45, 34, 73);
        transition: border-color 0.2s;
    }

    .post:hover {
        border-color: #9072d7;
    }

    .post-content {
        text-align: left;
        margin: 0.75rem 0;
    }

    .post-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    .post-header .left-section {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .post-header .username {
        margin-bottom: 0;
    }

    .post-bottom {
        border-top: 1px solid #3a3a3a;
        padding-top: 0.75rem;
    }

    .post-bottom a {
        color: #ccc;
        text-decoration: none;
        transition: color 0.2s;
    }

    .post-bottom a:hover {
        color: #a481f6;
    }
</style>