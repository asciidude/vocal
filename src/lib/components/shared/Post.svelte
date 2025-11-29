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
    import type { SubmitFunction } from "@sveltejs/kit";

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
    let isEditing = false;
    let editContent = '';
    let isSubmitting = false;

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

    function enableEditMode() {
        if (!post) return;
        isEditing = true;
        editContent = String(post.content);
    }

    function cancelEdit() {
        isEditing = false;
        editContent = '';
    }

    const editPost: SubmitFunction = () => {
        isSubmitting = true;
    
        return async ({ result }) => {
            isSubmitting = false;
            
            if (result.type === 'success' && result.status === 200) {
                if (post) {
                    post.content = editContent;
                    //post.updatedAt = new Date();
                }
                
                cancelEdit();
            }
        }
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

    function parseContent(content: string) {
        const hashtagRegex = /(#\w+)/g;
        const parts = content.split(hashtagRegex);
        
        return parts.map((part, index) => {
            if (part.match(hashtagRegex)) {
                const tag = part.slice(1);
                return {
                    type: 'hashtag',
                    content: part,
                    tag: tag,
                    key: index
                };
            }
            return {
                type: 'text',
                content: part,
                key: index
            };
        });
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

                            <DropdownMenu.Item
                                class="cursor-pointer font-light text-xl"
                            >
                                <button
                                    type="button"
                                    on:click={enableEditMode}
                                >
                                    <span class="text-xl">Edit</span>
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
            {#if isEditing}
                <form
                    action="/api/posts/edit/{post._id}"
                    method="post"
                    use:enhance={editPost}
                    class="edit-form"
                >
                    <input type="hidden" name="postType" value="{reply ? 'reply' : 'post'}" />
                    <input type="hidden" name="posterId" value={postAuthor!._id} />
                    <input type="hidden" name="content" value={editContent} />
                    
                    <textarea
                        bind:value={editContent}
                        class="w-full bg-transparent text-white text-2xl resize-none border border-vocal_lightest rounded-lg p-3 focus:outline-none focus:border-vocal_lightest"
                        rows="4"
                        placeholder="What's on your mind?"
                        disabled={isSubmitting}
                    ></textarea>
                    
                    <div class="flex justify-end gap-2 mt-3">
                        <button
                            type="button"
                            on:click={cancelEdit}
                            class="px-4 py-2 text-lg border border-gray-500 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            class="px-4 py-2 text-lg bg-vocal_lightest text-white rounded-lg hover:bg-vocal_light transition disabled:opacity-50"
                            disabled={isSubmitting || !editContent.trim()}
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            {:else}
                <p class="whitespace-pre-wrap">
                    {#each parseContent(String(post.content)) as part}
                        {#if part.type === 'hashtag'}
                            <a href="/hashtag/{part.tag}" class="text-vocal_lightest rounded">
                                {part.content}
                            </a>
                        {:else}
                            {part.content}
                        {/if}
                    {/each}
                </p>

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
                    {:else if post.attachments.length === 2}
                        <div
                            class="grid grid-cols-2 gap-2 max-w-[520px] sm:grid-cols-2"
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
        {/if}
    </div>

    {#if !isEditing}
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
    {/if}
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

    .edit-form textarea {
        min-height: 120px;
        font-family: inherit;
        line-height: 1.4;
    }

    .edit-form textarea:focus {
        border-color: #9072d7;
        box-shadow: 0 0 0 2px rgba(144, 114, 215, 0.2);
    }
</style>