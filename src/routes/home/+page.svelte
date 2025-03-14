<script lang="ts">
    import type { PageData } from './$types';
    import { onMount } from 'svelte';
    import Post from '$lib/components/shared/Post.svelte';
    import * as Avatar from "$lib/components/ui/avatar";
    import { Plus } from 'lucide-svelte';
    
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
</script>

<title>Vocal - Home</title>

<div class="flex flex-col min-h-screen bg-[#0a080f]">
    <header class="sticky top-0 z-10 bg-[#130f1b] border-b border-[#2d2249] p-4">
        <div class="container mx-auto flex justify-between items-center">
            <h1 class="text-2xl font-bold text-white">HOME</h1>
            {#if data.currentUser}
                <div class="flex items-center gap-2">
                    <Avatar.Root>
                        <Avatar.Image 
                            src={data.currentUser.avatarUrl} 
                            alt="@{data.currentUser.username}" 
                        />
                        <Avatar.Fallback>
                            {data.currentUser.displayName?.[0]?.toUpperCase() || data.currentUser.username[0].toUpperCase()}
                        </Avatar.Fallback>
                    </Avatar.Root>
                </div>
            {/if}
        </div>
    </header>

    <main class="container mx-auto flex-grow py-6">
        {#if data.currentUser}
            <div class="post mb-6">
                <div class="flex gap-3">
                    <Avatar.Root class="flex-shrink-0">
                        <Avatar.Image 
                            src={data.currentUser.avatarUrl} 
                            alt="@{data.currentUser.username}" 
                        />
                        <Avatar.Fallback>
                            {data.currentUser.displayName?.[0]?.toUpperCase() || data.currentUser.username[0].toUpperCase()}
                        </Avatar.Fallback>
                    </Avatar.Root>
                    <div class="flex-grow">
                        <textarea
                            class="w-full bg-transparent border border-[#2d2249] rounded-lg p-3 focus:border-[#9072d7] focus:outline-none resize-none"
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
                        post={post} 
                        postAuthor={data.usersMap[post.author.toString()]} 
                        postLikes={data.likesCountMap[post._id.toString()] || 0}
                        postReplies={data.repliesCountMap[post._id.toString()] || 0}
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

<style>
    .post {
        background-color: rgb(19, 15, 27);
        border-radius: 8px;
        padding: 1.25rem;
        border: 1px solid rgb(45, 34, 73);
        margin-right: 2rem;
        margin-left: 2rem;
    }
</style>