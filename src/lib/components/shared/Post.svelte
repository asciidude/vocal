<script lang="ts">
    import type { LikeType } from "src/lib/types/Like.type";
    import type { ReplyType } from "src/lib/types/Reply.type";
    import type { PostType } from "src/lib/types/Post.type";
    import { UserRoles, type UserType } from "$lib/types/User.types";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as Avatar from "$lib/components/ui/avatar";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Dot, Ellipsis, Heart, MessageCircle } from "lucide-svelte";
    import { getImage } from "$lib/utils/Cache.util";
    import { onMount } from "svelte";
    import Time from "svelte-time";

    const props = $props<{
        post: PostType | null;
        postAuthor: UserType | null;
        user: UserType | null;
        postLikes: LikeType[];
        postReplies: ReplyType[];
        postExpanded: boolean;
        redirectOnDelete: string | null;
        reply: boolean;
        postDeletion: (postId: string) => void;
    }>();

    let screenWidth = $state(0);
    let screenSmaller = $derived(screenWidth <= 713);
    let isEditing = $state(false);
    let editContent = $state("");
    let isSubmitting = $state(false);
    let liked = $state(false);
    let likeCount = $state(0);
    let avatarSrc = $state("");
    let modalOpen = $state(false);
    let modalImages = $state<string[]>([]);
    let modalStartIndex = $state(0);

    function parseContent(content: string) {
        const hashtagRegex = /(#\w+)/g;
        const parts = content.split(hashtagRegex);
        return parts.map((part, index) =>
            part.match(hashtagRegex)
                ? {
                      type: "hashtag",
                      content: part,
                      tag: part.slice(1),
                      key: index,
                  }
                : { type: "text", content: part, key: index },
        );
    }

    function enableEditMode() {
        if (!props.post) return;
        isEditing = true;
        editContent = props.post.content ?? "";
    }

    function cancelEdit() {
        isEditing = false;
        editContent = "";
    }

    function getPostImages(): string[] {
        return props.post?.attachments?.map((a) => a.url).filter(Boolean) ?? [];
    }

    function openModal(images: string[], startIndex = 0) {
        modalImages = images;
        modalStartIndex = startIndex;
        modalOpen = true;
    }

    $effect(() => {
        if (props.postLikes && props.user) {
            liked = props.postLikes.some(
                (like) => like.author.toString() === props.user?._id,
            );
            likeCount = props.postLikes.length;
        }
    });

    onMount(async () => {
        if (props.postAuthor?.avatarUrl) {
            avatarSrc = await getImage(props.postAuthor.avatarUrl);
        }
    });

    async function likePost(e: Event) {
        e.preventDefault();
        if (!props.post || isSubmitting) return;
        isSubmitting = true;

        try {
            const res = await fetch(`/api/posts/like/${props.post._id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postType: props.reply ? "reply" : "post",
                }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to like");

            liked = !!data.newlyLiked;
            likeCount = data.likeCount;
        } catch (err) {
            console.error(err);
        } finally {
            isSubmitting = false;
        }
    }

    async function deletePost() {
        if (!props.post) return;
        isSubmitting = true;

        try {
            const res = await fetch(`/api/posts/delete/${props.post._id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postType: props.reply ? "reply" : "post",
                    posterId: props.post.author
                }),
            });
            const data = await res.json();

            if (!res.ok || data.status !== 200) {
                throw new Error(data.message || "Failed to delete post");
            }

            props.postDeletion?.(props.post._id);

            if (props.redirectOnDelete === "back") {
                if (document.referrer?.startsWith(location.origin))
                    history.back();
                else window.location.href = "/home";
            } else if (props.redirectOnDelete) {
                window.location.href = props.redirectOnDelete;
            }
        } catch (err) {
            console.error(err);
        } finally {
            isSubmitting = false;
        }
    }

    async function submitEdit() {
        if (!props.post || !editContent.trim()) return;
        isSubmitting = true;

        try {
            const res = await fetch(`/api/posts/edit/${props.post._id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postType: props.reply ? "reply" : "post",
                    posterId: props.postAuthor?._id,
                    content: editContent,
                }),
            });

            const data = await res.json();

            if (!res.ok || data.status !== 200)
                throw new Error(data.message || "Failed to edit");

            props.post.content = editContent;
            cancelEdit();
        } catch (err) {
            console.error(err);
        } finally {
            isSubmitting = false;
        }
    }
</script>

<svelte:window bind:innerWidth={screenWidth} />

<div class="post text-white" id="post-{props.post?._id}">
    {#if props.post}
        <div class="post-header">
            <div class="left-section">
                <a
                    href="/users/{props.postAuthor?.username}"
                    class="flex items-center gap-2"
                >
                    <Avatar.Root>
                        <Avatar.Image
                            src={avatarSrc}
                            alt="@{props.postAuthor?.username}"
                        />
                        <Avatar.Fallback>
                            <img src="/images/fallback-pfp.jpg" alt="" />
                        </Avatar.Fallback>
                    </Avatar.Root>
                    <div class="username">
                        <div class="flex items-center gap-1 leading-none">
                            <p class="text-2xl font-medium">
                                {props.postAuthor?.displayName ||
                                    props.postAuthor?.username}
                            </p>
                            <span class="flex items-center">
                                <Dot class="size-3 text-gray-500 stroke-[3]" />
                            </span>
                            <span
                                class="text-gray-500 text-sm whitespace-nowrap"
                            >
                                <Time
                                    timestamp={new Date(props.post.createdAt)}
                                    relative
                                />
                            </span>
                        </div>
                        <p class="text-gray-400 text-md leading-tight">
                            @{props.postAuthor?.username}
                        </p>
                    </div>
                </a>
            </div>

            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    <Ellipsis class="size-5" />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                    class="text-white !bg-vocal_darkest border border-[#9072d7]"
                >
                    <DropdownMenu.Group>
                        {#if props.user?._id === props.postAuthor?._id || props.user?.roles.includes(UserRoles.SuperAdmin)}
                            <DropdownMenu.Item>
                                <button
                                    type="button"
                                    onclick={deletePost}
                                    disabled={isSubmitting}
                                >
                                    Delete
                                </button>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item>
                                <button type="button" onclick={enableEditMode}
                                    >Edit</button
                                >
                            </DropdownMenu.Item>
                        {/if}
                        <DropdownMenu.Item class="text-red-400"
                            >Report</DropdownMenu.Item
                        >
                    </DropdownMenu.Group>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>

        <div class="post-content text-2xl">
            {#if isEditing}
                <div>
                    <textarea
                        bind:value={editContent}
                        class="w-full bg-transparent text-white text-2xl resize-none border border-vocal_lightest rounded-lg p-3"
                        rows="4"
                    ></textarea>
                    <div class="flex justify-end gap-2 mt-3">
                        <button type="button" onclick={cancelEdit}
                            >Cancel</button
                        >
                        <button
                            type="button"
                            onclick={submitEdit}
                            disabled={!editContent.trim() || isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            {:else}
                <p class="whitespace-pre-wrap">
                    {#each parseContent(props.post.content ?? "") as part}
                        {#if part.type === "hashtag"}
                            <a
                                href="/hashtag/{part.tag}"
                                class="text-vocal_lightest">{part.content}</a
                            >
                        {:else}{part.content}{/if}
                    {/each}
                </p>

                {#if getPostImages().length > 0}
                    <div
                        class="post-images grid gap-2 mt-2"
                        style={`grid-template-columns: repeat(auto-fill, minmax(${screenSmaller ? "100px" : "120px"}, 1fr))`}
                    >
                        {#each props.postExpanded ? getPostImages() : getPostImages().slice(0, 4) as img, i}
                            <button
                                type="button"
                                class="relative cursor-pointer p-0 border-0 bg-transparent"
                                onclick={() => openModal(getPostImages(), i)}
                            >
                                <img
                                    src={img}
                                    class="object-cover w-full h-24 rounded-lg"
                                    alt="Post attachment"
                                />
                                {#if !props.postExpanded && i === 3 && getPostImages().length > 4}
                                    <a
                                        href={`/posts/${props.post._id}`}
                                        class="absolute inset-0 bg-black/60 flex justify-center items-center text-white text-2xl rounded-lg"
                                    >
                                        +{getPostImages().length - 4}
                                    </a>
                                {/if}
                            </button>
                        {/each}
                    </div>
                {/if}
            {/if}
        </div>

        <div class="post-bottom flex items-center gap-5 mt-2">
            <a
                class="flex items-center gap-2 mt-2"
                href={props.reply
                    ? `/replies/${props.post._id}`
                    : `/posts/${props.post._id}`}
            >
                <MessageCircle class="size-4 stroke-vocal_lightest" />
                <p class="size-6 text-lg">{props.postReplies.length}</p>
            </a>
            <button
                class="flex items-center mt-2"
                type="button"
                onclick={likePost}
                disabled={isSubmitting}
            >
                <Heart
                    class={`size-4 stroke-vocal_lightest ${liked ? "fill-vocal_lightest" : ""}`}
                />
                <p class="size-6 text-lg">{likeCount}</p>
            </button>
        </div>

        <!-- Image Modal -->
        <Dialog.Root bind:open={modalOpen}>
            <Dialog.Content
                class="bg-transparent border-none shadow-none max-w-[90vw] max-h-[90vh]"
            >
                <button
                    onclick={() => (modalOpen = false)}
                    class="absolute top-2 right-2 z-50 bg-gray-900 rounded-full p-2 hover:bg-gray-800 transition-colors"
                    aria-label="Close"
                >
                    <svg
                        class="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <div
                    class="relative flex flex-col items-center justify-center w-full h-full"
                >
                    <div class="flex items-center justify-center w-full h-full">
                        <img
                            src={modalImages[modalStartIndex]}
                            class="max-h-[70vh] max-w-[80vw] object-contain rounded-lg"
                            alt="Post attachment"
                        />
                    </div>
                </div>
            </Dialog.Content>
        </Dialog.Root>
    {/if}
</div>

<style>
    .post {
        background-color: rgb(19, 15, 27);
        border-radius: 8px;
        padding: 1.25rem;
        border: 1px solid rgb(45, 34, 73);
    }
    .post:hover {
        border-color: #9072d7;
    }
    .post-content {
        margin: 0.75rem 0;
    }
    .post-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .post-header .left-section {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .post-bottom {
        border-top: 1px solid #3a3a3a;
        padding-top: 0.75rem;
    }
    .post-images img {
        border-radius: 6px;
        object-fit: cover;
    }
</style>
