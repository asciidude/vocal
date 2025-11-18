<script lang="ts">
    import type { LikeType } from "src/lib/types/Like.type";
    import type { ReplyType } from "$lib/types/Reply.type";
    import type { PostType } from "$lib/types/Post.type";
    import type { UserType } from "$lib/types/User.types";

    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as Avatar from "$lib/components/ui/avatar";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Ellipsis, Heart, MessageCircle } from "lucide-svelte";

    import { getImage } from "$lib/utils/Cache.util";
    import { enhance } from "$app/forms";

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
    export let postLikes: LikeType[] = [];
    export let postReplies: ReplyType[] = [];
    export let postExpanded: Boolean = false;
    export let redirectOnDelete: String | null = null;
    export let reply: boolean = false;
    export let postDeletion: any = null;
    let screenWidth = 0;

    $: avatarSrc = "";

    $: if (postAuthor) {
        (async () => {
            avatarSrc = await getImage(postAuthor.avatarUrl);
        })();
    }

    function deletePost() {
        return async ({ result }) => {
            if (result.status === 200) {
                if(redirectOnDelete === 'back') {
                    if(document.referrer && document.referrer.startsWith(location.origin)) {
                        history.back();
                        return;
                    } else {
                        window.location.href = '/home';
                    }
                } else if(redirectOnDelete) {
                    window.location.href = String(redirectOnDelete);
                }

                document
                    .getElementById(`post-${post!._id}`)
                    ?.classList.add("hidden");
                
                postDeletion(post?._id);
            }
        };
    }

    let liked = false;
    let likeCount = 0;

    $: if (postLikes && user) {
        liked = postLikes.some(like => like.author.toString() === user._id);
        likeCount = postLikes.length;
    }

    function likePost() {
        return async ({ result }) => {
            if (result.status === 200) {
                if (result.newlyLiked) {
                    likeCount++;
                    liked = true;
                } else {
                    likeCount--;
                    liked = false;
                }
            }
        };
    }

    $: screenSmaller = screenWidth <= 713;
</script>

<svelte:window bind:innerWidth={screenWidth} />

<div class="post text-white" id="post-{post?._id}">
    <div class="post-header">
        {#if post}
            <div class="left-section">
                <a
                    href="/users/{postAuthor?.username}"
                    class="flex items-center gap-2"
                >
                    <Avatar.Root>
                        <Avatar.Image
                            src={avatarSrc}
                            alt="@{postAuthor?.username}"
                        />
                        <Avatar.Fallback>
                            {getInitials(
                                postAuthor?.displayName || postAuthor?.username,
                            )}
                        </Avatar.Fallback>
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

            <DropdownMenu.Root>
                <DropdownMenu.Trigger
                    ><Ellipsis class="size-5" /></DropdownMenu.Trigger
                >
                <DropdownMenu.Content
                    class="text-white !bg-vocal_darkest border border-[#9072d7]"
                >
                    <DropdownMenu.Group>
                        {#if user?._id === postAuthor!._id}
                            <form
                                action="/api/posts/delete/{post._id}"
                                method="post"
                                use:enhance={deletePost}
                                id="deletePost-{post._id}"
                            >
                                <input
                                    type="hidden"
                                    name="postType"
                                    value="{reply ? 'reply' : 'post'}"
                                />
                                <input
                                    type="hidden"
                                    name="posterId"
                                    value={postAuthor!._id}
                                />
                            </form>

                            <DropdownMenu.Item
                                class="cursor-pointer font-light text-xl"
                            >
                                <button
                                    type="button"
                                    on:click={() =>
                                        (
                                            document.getElementById(
                                                `deletePost-${post._id}`,
                                            ) as HTMLFormElement
                                        ).requestSubmit()}
                                >
                                    <span class="text-xl">Delete</span>
                                </button>
                            </DropdownMenu.Item>
                        {/if}
                        <DropdownMenu.Item
                            class="text-red-400 cursor-pointer text-xl font-light"
                        >
                            Report
                        </DropdownMenu.Item>
                    </DropdownMenu.Group>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        {/if}
    </div>

    <div class="post-content text-2xl">
        {#if post}
            <p class="whitespace-pre-wrap">{post.content}</p>

            {#if post.attachments.length > 0}
                {#if post.attachments.length === 1}
                    <div class="grid max-w-[520px]">
                        <Dialog.Root>
                            <Dialog.Trigger class="inline-flex w-fit h-fit">
                                <img
                                    src={post.attachments[0].url}
                                    alt={post.attachments[0].name}
                                    class=" aspect-square w-full max-w-[250px] rounded object-cover cursor-pointer hover:brightness-90 transition"
                                />
                            </Dialog.Trigger>
                            <Dialog.Content
                                class="bg-vocal_darkest text-white border-vocal_strong p-4 rounded-lg"
                            >
                                <Dialog.Header>
                                    <Dialog.Description>
                                        <img
                                            src={post.attachments[0].url}
                                            alt={post.attachments[0].name}
                                            class="w-full max-w-[500px] rounded object-cover"
                                        />
                                    </Dialog.Description>
                                </Dialog.Header>
                            </Dialog.Content>
                        </Dialog.Root>
                    </div>
                {:else if post.attachments.length === 3}
                    <div
                        class="grid grid-cols-2 gap-2 max-w-[520px] sm:grid-cols-3"
                        style="grid-auto-rows: 1fr;"
                    >
                        {#each post.attachments as attachment}
                            <Dialog.Root>
                                <Dialog.Trigger class="inline-flex w-full h-full">
                                    <div class="aspect-square w-full overflow-hidden rounded">
                                        <img
                                            src={attachment.url}
                                            alt={attachment.name}
                                            class="w-full h-full object-cover cursor-pointer hover:brightness-90 transition"
                                        />
                                    </div>
                                </Dialog.Trigger>
                                <Dialog.Content class="bg-vocal_darkest text-white border-vocal_strong p-4 rounded-lg">
                                    <Dialog.Header>
                                        <Dialog.Description>
                                            <img
                                                src={attachment.url}
                                                alt={attachment.name}
                                                class="w-full h-full rounded object-cover"
                                            />
                                        </Dialog.Description>
                                    </Dialog.Header>
                                </Dialog.Content>
                            </Dialog.Root>
                        {/each}
                    </div>
                {:else if post.attachments.length === 3}
                    {#if screenSmaller}
                        <div class="grid grid-cols-2 gap-2 max-w-[520px]">
                            {#each post.attachments.slice(0, 2) as attachment}
                                <Dialog.Root>
                                    <Dialog.Trigger class="inline-flex w-fit h-fit">
                                        <div
                                            class="aspect-square w-full overflow-hidden rounded"
                                        >
                                            <img
                                                src={attachment.url}
                                                alt={attachment.name}
                                                class="h-full w-full object-cover cursor-pointer hover:brightness-90 transition"
                                            />
                                        </div>
                                    </Dialog.Trigger>
                                    <Dialog.Content
                                        class="bg-vocal_darkest text-white border-vocal_strong p-4 rounded-lg"
                                    >
                                        <Dialog.Header>
                                            <Dialog.Description>
                                                <img
                                                    src={attachment.url}
                                                    alt={attachment.name}
                                                    class="w-full max-w-[500px] rounded object-cover"
                                                />
                                            </Dialog.Description>
                                        </Dialog.Header>
                                    </Dialog.Content>
                                </Dialog.Root>
                            {/each}
                        </div>
                        <div class="grid mt-2">
                            <Dialog.Root>
                                <Dialog.Trigger class="inline-flex w-fit h-fit">
                                    <div
                                        class="w-full max-w-[500px] overflow-hidden rounded"
                                    >
                                        <img
                                            src={post.attachments[2].url}
                                            alt={post.attachments[2].name}
                                            class="w-full object-cover cursor-pointer hover:brightness-90 transition"
                                        />
                                    </div>
                                </Dialog.Trigger>
                                <Dialog.Content
                                    class="bg-vocal_darkest text-white border-vocal_strong p-4 rounded-lg"
                                >
                                    <Dialog.Header>
                                        <Dialog.Description>
                                            <img
                                                src={post.attachments[2].url}
                                                alt={post.attachments[2].name}
                                                class="w-full max-w-[500px] rounded object-cover"
                                            />
                                        </Dialog.Description>
                                    </Dialog.Header>
                                </Dialog.Content>
                            </Dialog.Root>
                        </div>
                    {:else}
                        <div class="grid grid-cols-3 gap-2 max-w-[520px]">
                            {#each post.attachments as attachment}
                                <Dialog.Root>
                                    <Dialog.Trigger class="inline-flex w-fit h-fit">
                                        <div
                                            class="aspect-square w-full overflow-hidden rounded"
                                        >
                                            <img
                                                src={attachment.url}
                                                alt={attachment.name}
                                                class="h-full w-full object-cover cursor-pointer hover:brightness-90 transition"
                                            />
                                        </div>
                                    </Dialog.Trigger>
                                    <Dialog.Content
                                        class="bg-vocal_darkest text-white border-vocal_strong p-4 rounded-lg"
                                    >
                                        <Dialog.Header>
                                            <Dialog.Description>
                                                <img
                                                    src={attachment.url}
                                                    alt={attachment.name}
                                                    class="w-full max-w-[500px] rounded object-cover"
                                                />
                                            </Dialog.Description>
                                        </Dialog.Header>
                                    </Dialog.Content>
                                </Dialog.Root>
                            {/each}
                        </div>
                    {/if}
                {:else}
                    <div class="grid {postExpanded ? 'grid-cols-4' : 'grid-cols-2'} gap-2 { postExpanded ? 'max-w-[65rem]' : 'max-w-[520px]' }">
                        {#each (postExpanded ? post.attachments : post.attachments.slice(0, 4)) as attachment, i}
                            <div class="relative aspect-square rounded overflow-hidden">
                                <Dialog.Root>
                                    <Dialog.Trigger class="inline-flex w-fit h-fit">
                                        <img
                                            src={attachment.url}
                                            alt={attachment.name}
                                            class="absolute top-0 left-0 w-full h-full object-cover cursor-pointer hover:brightness-90 transition"
                                        />
                                    </Dialog.Trigger>
                                    <Dialog.Content class="bg-vocal_darkest text-white border-vocal_strong p-4 rounded-lg">
                                        <Dialog.Header>
                                            <Dialog.Description>
                                                <img
                                                    src={attachment.url}
                                                    alt={attachment.name}
                                                    class="w-full max-w-[500px] rounded object-cover"
                                                />
                                            </Dialog.Description>
                                        </Dialog.Header>
                                    </Dialog.Content>
                                </Dialog.Root>

                                {#if !postExpanded}
                                    {#if i === 3 && post.attachments.length > 4}
                                        <a
                                            href="/posts/{post._id}"
                                            class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold"
                                        >
                                            +{post.attachments.length - 4}
                                        </a>
                                    {/if}
                                {/if}
                            </div>
                        {/each}
                    </div>
                {/if}
            {/if}
        {/if}
    </div>

    <div class="post-bottom flex items-center gap-5 mt-2">
        <a class="flex items-center gap-2 mt-2" href={reply ? `/replies/${post?._id}` : `/posts/${post?._id}`}>
            <MessageCircle class="size-4 stroke-vocal_lightest" />
            <p class="size-6 text-lg">
                {postReplies.length}
            </p>
        </a>
        <form
            action="/api/posts/like/{post?._id}"
            method="post"
            use:enhance={likePost}
        >
            <button
                class="flex items-center mt-2"
                type="submit"
            >
                <Heart
                    class={`size-4 stroke-vocal_lightest ${liked ? 'fill-vocal_lightest' : ''}`}
                />
                <p class="size-6 text-lg">{likeCount}</p>
            </button>
        </form>
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
    .post-bottom button {
        color: #ccc;
        text-decoration: none;
        transition: color 0.2s;
    }

    .post-bottom a:hover {
        color: #a481f6;
    }
    .post-bottom button:hover {
        color: #a481f6;
    }
</style>
