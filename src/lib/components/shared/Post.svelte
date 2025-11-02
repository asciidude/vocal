<script lang="ts">
    import type { PostType } from "$lib/types/Post.type";
    import type { UserType } from "$lib/types/User.types";

    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as Avatar from "$lib/components/ui/avatar";
    import { Ellipsis, Heart, MessageCircle } from "lucide-svelte";

    import { onMount } from "svelte";
    import { getImage } from "$lib/utils/Cache.util";

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

    $: avatarSrc = '';

    $: if (postAuthor) {
        (async () => {
            avatarSrc = await getImage(postAuthor.avatarUrl);
        })();
    }
</script>

<div class="post text-white">
    <div class="post-header">
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

        <!-- work on form for this, or sm -->
        <DropdownMenu.Root>
            <DropdownMenu.Trigger><Ellipsis class="size-5" /></DropdownMenu.Trigger>
            <DropdownMenu.Content class="text-white !bg-vocal_darkest border border-[#9072d7]">
                <DropdownMenu.Group>
                    {#if user._id === postAuthor._id}
                        <DropdownMenu.Item class="`cur`sor-pointer font-light text-xl">Delete</DropdownMenu.Item>
                    {/if}
                    <DropdownMenu.Item class="text-red-400 cursor-pointer text-xl font-light">Report</DropdownMenu.Item>
                </DropdownMenu.Group>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </div>
    <div class="post-content text-2xl">
        <p>{post?.content}</p>
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