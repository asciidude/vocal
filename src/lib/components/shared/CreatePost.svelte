<script lang="ts">
    import { onMount } from "svelte";
    import { Plus, Image } from "lucide-svelte";
    import X from "@lucide/svelte/icons/x";
    import type { UserType } from "$lib/types/User.types";
    import { getImage } from "$lib/utils/Cache.util";
    import * as Avatar from "$lib/components/ui/avatar/index.js";

    export let user: UserType | null = null;
    export let postSubmission: (post: any) => void;
    export let postType: "reply" | "post";
    export let replyParent: string = "";

    type FileWithPreview = { file: File; previewUrl: string };
    let files: FileWithPreview[] = [];
    let isSubmitting = false;
    let currentUserAv: string | null = null;
    let newPostContent = "";
    let screenWidth = 0;
    $: screenSmaller = screenWidth <= 577;

    onMount(async () => {
        if (user?.avatarUrl) {
            currentUserAv = await getImage(user.avatarUrl);
        }
    });

    function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files) return;

        const selectedFiles = Array.from(input.files);
        const newFiles = selectedFiles.map((file) => {
            const previewUrl =
                file.type.startsWith("image/") || file.type.startsWith("video/")
                    ? URL.createObjectURL(file)
                    : "";
            return { file, previewUrl };
        });

        files = [...files, ...newFiles].slice(0, 10);
        input.value = "";
    }

    function removeFile(index: number) {
        URL.revokeObjectURL(files[index].previewUrl);
        files.splice(index, 1);
        files = [...files];
    }

    async function submitPost(formEl: HTMLFormElement) {
        if (isSubmitting) return; // guard against double submit
        isSubmitting = true;

        const formData = new FormData(formEl);
        files.forEach((f) => formData.append("attachments", f.file));

        try {
            const res = await fetch(formEl.action, {
                method: "POST",
                body: formData,
            });

            const result = await res.json();
            if (result.status === 200) {
                newPostContent = "";
                files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
                files = [];
                postSubmission(result.post);
            }
        } catch (err) {
            console.error("Post submission failed:", err);
        } finally {
            isSubmitting = false;
        }
    }
</script>

<svelte:window bind:innerWidth={screenWidth} />

{#if user}
    <div class="post mb-6">
        <div class="flex gap-3">
            <Avatar.Root class="flex-shrink-0">
                <a href={`/users/${user.username}`}>
                    <Avatar.Image
                        src={currentUserAv}
                        alt={`@${user.username}`}
                    />
                    <Avatar.Fallback>
                        <img src="/images/fallback-pfp.jpg" alt="" />
                    </Avatar.Fallback>
                </a>
            </Avatar.Root>

            <form
                action="/api/posts/create"
                method="post"
                enctype="multipart/form-data"
                class="flex-grow"
                on:submit|preventDefault={() =>
                    submitPost(
                        document.getElementById("postForm") as HTMLFormElement,
                    )}
                id="postForm"
            >
                <input type="hidden" name="postType" value={postType} />
                {#if postType === "reply"}
                    <input
                        type="hidden"
                        name="replyParent"
                        value={replyParent}
                    />
                {/if}

                <textarea
                    class="w-full bg-transparent border border-[#2d2249] rounded-lg p-3 focus:border-vocal_medium focus:outline-none resize-none text-white placeholder-gray-500 text-2xl"
                    rows="3"
                    placeholder="What's on your mind?"
                    bind:value={newPostContent}
                    name="content"
                    disabled={isSubmitting}
                ></textarea>

                {#if files.length > 0}
                    <div
                        class="grid gap-2 mt-2"
                        style={`grid-template-columns: repeat(auto-fill, minmax(${screenSmaller ? "100px" : "120px"}, 1fr));`}
                    >
                        {#each files as file, i}
                            <div
                                class="relative border border-vocal_strongest rounded overflow-hidden"
                            >
                                <img
                                    src={file.previewUrl}
                                    alt="Preview"
                                    class="object-cover w-full h-24"
                                />
                                <button
                                    type="button"
                                    on:click={() => removeFile(i)}
                                    class="absolute top-1 right-1 bg-vocal_strong hover:bg-vocal_strongest rounded-full p-1 transition"
                                    disabled={isSubmitting}
                                >
                                    <X class="size-3 text-white" />
                                </button>
                            </div>
                        {/each}
                    </div>
                {/if}

                <div class="flex justify-end gap-2 mt-2">
                    <input
                        id="fileUpload"
                        type="file"
                        class="hidden"
                        accept="image/*"
                        multiple
                        on:change={handleFileChange}
                    />
                    <button
                        type="button"
                        class="bg-vocal_medium hover:bg-vocal_lightest text-white px-4 py-2 rounded-full flex items-center gap-2 transition disabled:bg-vocal_strong disabled:cursor-default"
                        disabled={isSubmitting || files.length >= 10}
                        on:click={() =>
                            document.getElementById("fileUpload")?.click()}
                    >
                        <Image class="size-5" /> Upload
                    </button>

                    <button
                        type="submit"
                        class="ms-2 bg-vocal_medium hover:bg-vocal_lightest text-white px-4 py-2 rounded-full flex items-center gap-2 transition disabled:bg-vocal_strong disabled:cursor-default"
                        disabled={isSubmitting || !newPostContent.trim()}
                    >
                        <Plus class="size-5" /> Post
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
