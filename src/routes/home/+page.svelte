<script lang="ts">
    import type { PageData } from "./$types";
    import Post from "$lib/components/shared/Post.svelte";
    import * as Avatar from "$lib/components/ui/avatar";
    import { getImage } from "src/lib/utils/Cache.util";
    import { onMount } from "svelte";
    import type { ReplyType } from "$lib/types/Reply.type";
    import type { LikeType } from "$lib/types/Like.type";
    import CreatePost from "src/lib/components/shared/CreatePost.svelte";

    export let data: PageData;

    let currentUserAv = "";

    let posts: typeof data.posts = [];
    $: posts;

    const submitPost = (post) => {
        posts = [{ ...post, authorObj: data.user }, ...posts];
    }

    const deletePost = (postId) => {
        posts = posts.filter(p => p._id !== postId);
    }

    onMount(async () => {
        posts = data.posts;
        currentUserAv = await getImage(data.user?.avatarUrl);
    });
</script>

<title>Vocal - Home</title>

<div class="flex flex-col min-h-screen bg-vocal_dark_bg">
    <header
        class="sticky top-0 z-10 bg-[#130f1b] border-b border-[#2d2249] p-4"
    >
        <div class="container mx-auto flex justify-between items-center">
            <h1 class="text-3xl font-bold text-white">Home</h1>
            {#if data.user}
                <div class="flex items-center gap-2">
                    <a href="/users/{data.user._id}">
                        <Avatar.Root>
                            <Avatar.Image
                                src={data.user.avatarUrl}
                                alt="@{data.user.username}"
                            />
                            <Avatar.Fallback>
                                {data.user.displayName || data.user.username}
                            </Avatar.Fallback>
                        </Avatar.Root>
                    </a>
                </div>
            {/if}
        </div>
    </header>

    <main class="container mx-auto flex-grow py-6">
        <CreatePost
            user={data.user ?? null}
            postSubmission={submitPost}
        />

        <div class="space-y-4" id="postArea">
            {#if posts && posts.length > 0}
                {#each posts as post (post._id)}
                    <Post
                        {post}
                        postAuthor={post.authorObj}
                        postLikes={data.likes.filter(
                            (p: LikeType) => p.parent_post === post._id,
                        )}
                        postReplies={data.replies.filter(
                            (p: ReplyType) => p.parent_post === post._id,
                        )}
                        user={data.user}
                        postExpanded={false}
                        postDeletion={deletePost}
                    />
                {/each}
            {:else}
                <div
                    class="flex flex-col items-center justify-center p-8 text-center"
                >
                    <p class="text-gray-400 mb-2">No posts yet</p>
                    <p class="text-sm text-gray-500">
                        Be the first to create a post!
                    </p>
                </div>
            {/if}
        </div>
    </main>
</div>
