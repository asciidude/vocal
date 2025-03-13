<script lang="ts">
    import type { PostType } from "$lib/types/Post.type";
    import type { UserType } from "$lib/types/User.types";

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
    export let postLikes: Number = 0;

    let avatarSrc = '';

    onMount(async () => {
        avatarSrc = await getImage(postAuthor?.avatarUrl);
    });
</script>

<div class="post">
    <div class="post-header">
        <div class="left-section">
            <a href="/users/{post?.author}" class="flex items-center gap-2">
                <Avatar.Root>
                    <Avatar.Image src={avatarSrc} alt="@{postAuthor?.username}" />
                    <Avatar.Fallback
                        >{getInitials(
                            postAuthor?.displayName || postAuthor?.username,
                        )}</Avatar.Fallback
                    >
                </Avatar.Root>
                <div class="username">
                    <p class="leading-none">
                        {postAuthor?.displayName}
                    </p>
                    <p class="text-sm text-gray-400">
                        @{postAuthor?.username}
                    </p>
                </div>
            </a>
        </div>
        <Ellipsis class="size-5" />
    </div>
    <div class="post-content">
        <p>{post?.content}</p>
    </div>
    <div class="post-bottom flex items-center gap-5 mt-2">
        <a class="flex items-center gap-2 mt-2" href="/posts/{post._id}">
            <MessageCircle class="size-4" />
            <p class="size-5">
                {postLikes}
            </p>
        </a>
        <a class="flex items-center gap-2 mt-2" href="/api/like/{post._id}">
            <Heart class="size-4" />
            <p class="size-5">
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
        margin-right: 2rem;
        margin-left: 2rem;
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