<script lang="ts">
    import type { PageData } from "./$types";
    import Post from "$lib/components/shared/Post.svelte";
    import * as Avatar from "$lib/components/ui/avatar";
    import { onMount, tick } from "svelte";
    import type { ReplyType } from "$lib/types/Reply.type";
    import type { LikeType } from "$lib/types/Like.type";
    import CreatePost from "src/lib/components/shared/CreatePost.svelte";

    const { data } = $props<{ data: PageData }>();

    let posts = $state<typeof data.posts>([]);
    let page = $state(1);
    let isLoading = $state(false);
    let hasMore = $state(true);
    let observer: IntersectionObserver;

    const submitPost = (post) => {
        posts = [{ ...post, authorObj: data.user }, ...posts];
    }

    const deletePost = (postId) => {
        posts = posts.filter(p => p._id !== postId);
    }

    const loadPosts = async () => {
        if(isLoading || !hasMore) return;

        isLoading = true;
        page++;

        try {
            const response = await fetch(`/api/feed?page=${page}&limit=5&minSimilarity=0.1`)
            const result = await response.json();

            if(result.feed.length === 0) {
                hasMore = false;
                return;
            }
            
            const existingIds = new Set(posts.map(p => p._id));
            const newPosts = result.feed.filter(post => !existingIds.has(post._id));

            if (newPosts.length === 0) {
                console.log('All loaded posts were duplicates, trying next page');
                return loadPosts();
            }

            posts = [...posts, ...newPosts];
        } catch(err) {
            console.error('Failed to load more posts:', err);
            page--;
        } finally {
            isLoading = false;
        }
    }

    const setupObserver = async () => {
        await tick();
        
        observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting && !isLoading && hasMore) {
                loadPosts();
            }
        }, { threshold: 0.1 });

        const sentinel = document.getElementById('sentinel');
        console.log('Sentinel found after tick:', !!sentinel);
        if (sentinel) {
            observer.observe(sentinel);
        }
    }

    onMount(async () => {
        posts = data.posts;
        await setupObserver();
    });

    $effect.pre(() => {
        if(observer) {
            observer.disconnect();
            const sentinel = document.getElementById('sentinel');
            if (sentinel) observer.observe(sentinel);
        }
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
            postType={'post'}
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
                
                <div id="sentinel" class="h-10 flex items-center justify-center">
                    {#if isLoading}
                        <div class="text-gray-400">Loading more posts...</div>
                    {:else if hasMore}
                        <div class="h-1"></div>
                    {:else if posts.length >= 10}
                        <div class="text-gray-500 text-sm py-4">No more posts to load</div>
                    {/if}
                </div>
            {:else if !isLoading}
                <div class="flex flex-col items-center justify-center p-8 text-center">
                    <p class="text-gray-400 mb-2">No posts yet</p>
                    <p class="text-sm text-gray-500">
                        Be the first to create a post!
                    </p>
                </div>
            {/if}
        </div>
    </main>
</div>
