<script lang="ts">
    import type { UserType } from "$lib/types/User.types";

    import * as Avatar from "$lib/components/ui/avatar";
    import { Ellipsis, Heart, MessageCircle } from "lucide-svelte";

    import { onMount } from "svelte";
    import { getImage } from "$lib/utils/Cache.util";
    import type { ReplyType } from "src/lib/types/Reply.type";

    function getInitials(name: string | undefined) {
        if (!name) return "?";
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    }

    export let reply: ReplyType | null = null;
    export let replyAuthor: UserType | null = null;
    export let replyLikes: Number = 0;
    export let replyReplies: Number = 0;

    let avatarSrc = '';

    onMount(async () => {
        avatarSrc = await getImage(replyAuthor?.avatarUrl);
    });
</script>

<div class="post">
    <div class="post-header">
        <div class="left-section">
            <a href="/users/{reply?.author}" class="flex items-center gap-2">
                <Avatar.Root>
                    <Avatar.Image src={avatarSrc} alt="@{replyAuthor?.username}" />
                    <Avatar.Fallback
                        >{getInitials(
                            replyAuthor?.displayName || replyAuthor?.username,
                        )}</Avatar.Fallback
                    >
                </Avatar.Root>
                <div class="username">
                    <p class="leading-none">
                        {replyAuthor?.displayName}
                    </p>
                    <p class="text-sm text-gray-400">
                        @{replyAuthor?.username}
                    </p>
                </div>
            </a>
        </div>
        <Ellipsis class="size-5" />
    </div>
    <div class="post-content">
        <p>{reply?.content}</p>
    </div>
    <div class="post-bottom flex items-center gap-5 mt-2">
        <a class="flex items-center gap-2 mt-2" href="/posts/{reply?._id}">
            <MessageCircle class="size-4" />
            <p class="size-5">
                {replyReplies}
            </p>
        </a>
        <a class="flex items-center gap-2 mt-2" href="/api/like/{reply?._id}">
            <Heart class="size-4" />
            <p class="size-5">
                {replyLikes}
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
