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
    let bannerSrc = '';

    onMount(async () => {
        avatarSrc = await getImage(postAuthor?.avatarUrl);
        bannerSrc = await getImage(postAuthor?.bannerUrl);

        const header = document.getElementById("profileHeader");
        header!.style.background = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bannerSrc})`;
        header!.style.backgroundRepeat = "no-repeat";
        header!.style.backgroundPosition = "center";
        header!.style.backgroundSize = "cover";
    });
</script>

<div class="post">
    <div class="post-header">
        <div class="left-section">
            <a href="/users/{post?.author}" class="flex items-center gap-2">
                <Avatar.Root>
                    <Avatar.Image src={postAuthor?.avatarUrl} alt="@{postAuthor?.username}" />
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
