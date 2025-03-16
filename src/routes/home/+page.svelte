<script lang="ts">
    import type { PageData } from './$types';
    import Post from '$lib/components/shared/Post.svelte';
    import * as Avatar from "$lib/components/ui/avatar";
    import { Plus } from 'lucide-svelte';
    import { getImage } from 'src/lib/utils/Cache.util';
    import { onMount } from 'svelte';
    import type { ReplyType } from '$lib/types/Reply.type';
    import type { LikeType } from '$lib/types/Like.type';

    export let data: PageData;
    
    let newPostContent = '';
    let isSubmitting = false;
    
    async function handleSubmitPost() {
        if (!newPostContent.trim()) return;
        
        isSubmitting = true;
        
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: newPostContent
                })
            });
            
            if (response.ok) {
                newPostContent = '';
                window.location.reload();
            } else {
                console.error('Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            isSubmitting = false;
        }
    }

    let avatars = new Map();
    let currentUserAv = '';

    onMount(async () => {
        currentUserAv = await getImage(data.user?.avatarUrl);

        for(let post of data.posts) {
            if(avatars.get(post.author._id)) return;
            avatars.set(post.author._id, post.author.avatarUrl)
        }
    });
</script>

<title>Vocal - Home</title>

<div class="flex flex-col min-h-screen bg-[#0a080f]">
    <header class="sticky top-0 z-10 bg-[#130f1b] border-b border-[#2d2249] p-4">
        <div class="container mx-auto flex justify-between items-center">
            <h1 class="text-2xl font-bold text-white">HOME</h1>
            {#if data.user}
                <div class="flex items-center gap-2">
                    <Avatar.Root>
                        <Avatar.Image 
                            src={data.user.avatarUrl} 
                            alt="@{data.user.username}" 
                        />
                        <Avatar.Fallback>
                            {data.user.displayName || data.user.username}
                        </Avatar.Fallback>
                    </Avatar.Root>
                </div>
            {/if}
        </div>
    </header>

    <main class="container mx-auto flex-grow py-6">
        {#if data.user}
            <div class="post mb-6">
                <div class="flex gap-3">
                    <Avatar.Root class="flex-shrink-0">
                        <Avatar.Image 
                            src={currentUserAv} 
                            alt="@{data.user.username}" 
                        />
                        <Avatar.Fallback>
                            {data.user.displayName || data.user.username}
                        </Avatar.Fallback>
                    </Avatar.Root>
                    <div class="flex-grow">
                        <textarea
                            class="w-full bg-transparent border border-[#2d2249] rounded-lg p-3 focus:border-[#9072d7] focus:outline-none resize-none text-white placeholder-gray-500"
                            rows="3"
                            placeholder="What's on your mind?"
                            bind:value={newPostContent}
                        ></textarea>
                        <div class="flex justify-end mt-2">
                            <button
                                class="bg-[#9072d7] hover:bg-[#a481f6] text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors"
                                on:click={handleSubmitPost}
                                disabled={isSubmitting || !newPostContent.trim()}
                            >
                                <Plus class="size-4" />
                                <span>Post</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        {/if}

        <div class="space-y-4">
            {#if data.posts && data.posts.length > 0}
                {#each data.posts as post}
                    <Post 
                        {post} 
                        postAuthor={post.author} 
                        postLikes={data.likes.filter((p: LikeType) => p.parent_post === post._id).length}
                        postReplies={data.replies.filter((p: ReplyType) => p.parent_post === post._id).length}
                    />
                {/each}
            {:else}
                <div class="flex flex-col items-center justify-center p-8 text-center">
                    <p class="text-gray-400 mb-2">No posts yet</p>
                    <p class="text-sm text-gray-500">Be the first to create a post!</p>
                </div>
            {/if}
        </div>
    </main>
</div>