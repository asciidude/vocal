<script lang="ts">
    import type { PageData } from './$types';
    import Post from '$lib/components/shared/Post.svelte';
    import * as Avatar from "$lib/components/ui/avatar";
    import { Plus, Image } from 'lucide-svelte';
    import { getImage } from 'src/lib/utils/Cache.util';
    import { onMount } from 'svelte';
    import type { ReplyType } from '$lib/types/Reply.type';
    import type { LikeType } from '$lib/types/Like.type';
    import { enhance } from '$app/forms';
    import X from '@lucide/svelte/icons/x';

    export let data: PageData;
    let isSubmitting = false;

    let currentUserAv = '';

    type FileWithPreview = {
        file: File;
        previewUrl: string;
    }

    let newPostContent = '';
    let files: FileWithPreview[] = [];
    let posts: typeof data.posts = [];
    $: posts;
        
    const enhanceForm = ({ formData }) => {
        files.forEach(({ file }) => formData.append('attachments', file));
        isSubmitting = true;
        return async ({ result, update }) => {
            await update();
            if (result.status === 200 && result.post) {
                posts = [{ ...result.post, authorObj: data.user }, ...posts];
                newPostContent = '';
                files = [];
            }
            isSubmitting = false;
        };
    };


    function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files) return;

        const selectedFiles = Array.from(input.files);

        const newFiles = selectedFiles.map((file) => {
            let previewUrl = '';

            if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                previewUrl = URL.createObjectURL(file);
            }

            return { file, previewUrl };
        });

        files = [...files, ...newFiles].slice(0, 10);

        input.value = '';
    }

    function removeFile(index: number) {
        URL.revokeObjectURL(files[index].previewUrl);
        files.splice(index, 1);
        files = [...files];
    }

    onMount(async () => {
        posts = data.posts; 
        currentUserAv = await getImage(data.user?.avatarUrl);
    });

    let screenWidth = 0;
    $: screenSmaller = screenWidth <= 577;
</script>

<svelte:window bind:innerWidth={screenWidth} />

<title>Vocal - Home</title>

<div class="flex flex-col min-h-screen bg-[#0a080f]">
    <header class="sticky top-0 z-10 bg-[#130f1b] border-b border-[#2d2249] p-4">
        <div class="container mx-auto flex justify-between items-center">
            <h1 class="text-3xl font-bold text-white">Home</h1>
            {#if data.user}
                <div class="flex items-center gap-2">
                    <a href="/users/{data.user.discordId}">
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
        {#if data.user}
            <div class="post mb-6">
                <div class="flex gap-3">
                    <Avatar.Root class="flex-shrink-0">
                        <a href="/users/{data.user.discordId}">
                            <Avatar.Image 
                                src={currentUserAv} 
                                alt="@{data.user.username}" 
                            />
                            <Avatar.Fallback>
                                {data.user.displayName || data.user.username}
                            </Avatar.Fallback>
                        </a>
                    </Avatar.Root>

                    <form
                        action="/api/posts/create" method="post"
                        enctype="multipart/form-data"
                        use:enhance={enhanceForm}
                        id="postSubmission"
                        class="flex-grow"
                        on:submit|preventDefault={() => isSubmitting = true}
                    >
                        <input type="hidden" name="postType" value="post">
                        <textarea
                            class="w-full bg-transparent border border-[#2d2249] rounded-lg p-3 focus:border-vocal_medium focus:outline-none resize-none text-white placeholder-gray-500 text-2xl"
                            rows="3"
                            placeholder="What's on your mind?"
                            bind:value={newPostContent}
                            name="content" id="content"
                        ></textarea>

                        <div class="flex justify-end mt-2 flex-col gap-3">
                            <!-- file previews -->
                            {#if files.length > 0}
                                <div class="grid gap-2" style={`grid-template-columns: repeat(auto-fill, minmax(${screenSmaller ? '100px' : '120px'}, 1fr));`}>
                                    {#each files as file, i}
                                        <div class="relative border border-vocal_strongest rounded overflow-hidden">
                                            <img src={file.previewUrl} alt="Preview" class="object-cover w-full h-24" />
                                            <button type="button"
                                                on:click={() => removeFile(i)}
                                                class="absolute top-1 right-1 bg-vocal_strong hover:bg-vocal_strongest rounded-full p-1 transition"
                                                disabled={isSubmitting}>
                                                <X class="size-3 text-white" />
                                            </button>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                            
                            <div class="flex justify-end gap-2">
                                <!-- buttons -->
                                <input
                                    id="fileUpload"
                                    type="file"
                                    name="attachments"
                                    class="hidden"
                                    accept="image/*"
                                    multiple
                                    on:change={handleFileChange}
                                />

                                <button
                                    class="bg-vocal_medium hover:bg-vocal_lightest text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors cursor-pointer disabled:bg-vocal_strong disabled:cursor-default"
                                    disabled={isSubmitting || !newPostContent.trim() || files.length >= 10}
                                    on:click={() => document.getElementById('fileUpload')?.click()}
                                    type="button"
                                >
                                    <Image class="size-5"/>
                                    <span class="text-xl">Upload</span>
                                </button>

                                <button
                                    class="ms-2 bg-vocal_medium hover:bg-vocal_lightest text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors cursor-pointer disabled:bg-vocal_strong disabled:cursor-default"
                                    disabled={isSubmitting || !newPostContent.trim()}
                                    type="submit"
                                >
                                    <Plus class="size-5" />
                                    <span class="text-xl">Post</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        {/if}

        <div class="space-y-4" id="postArea">
            {#if posts && posts.length > 0}
                {#each posts as post (post._id)}
                    <Post 
                        {post} 
                        postAuthor={post.authorObj}
                        postLikes={data.likes.filter((p: LikeType) => p.parent_post === post._id)}
                        postReplies={data.replies.filter((p: ReplyType) => p.parent_post === post._id)}
                        user={data.user}
                        postExpanded={false}
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
