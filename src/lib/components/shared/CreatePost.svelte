<script lang="ts">
    import { onMount } from "svelte";
    import { Plus, Image } from "lucide-svelte";
    import X from "@lucide/svelte/icons/x";
    import type { UserType } from "$lib/types/User.types";
    import type { PostType } from "$lib/types/Post.type";
    import { getImage } from "$lib/utils/Cache.util";
    import * as Avatar from "$lib/components/ui/avatar/index.js";

    const props = $props<{
        user: UserType | null;
        postSubmission: (post: PostType) => void;
        postType: "reply" | "post";
        replyParent?: string;
    }>();

    type FileWithPreview = { file: File; previewUrl: string };
    let files = $state<FileWithPreview[]>([]);
    let isSubmitting = $state(false);
    let currentUserAv = $state<string | null>(null);
    let newPostContent = $state("");
    let screenWidth = $state(0);
    let screenSmaller = $derived(screenWidth <= 577);

    onMount(async () => {
        if (props.user?.avatarUrl) {
            currentUserAv = await getImage(props.user.avatarUrl);
        }
    });

    async function submitPost() {
        if (!newPostContent.trim() || isSubmitting) return;

        isSubmitting = true;
        const formData = new FormData();
        formData.append("content", newPostContent);
        formData.append("postType", props.postType);
        if (props.postType === "reply" && props.replyParent) {
            formData.append("replyParent", props.replyParent);
        }
        files.forEach((f) => formData.append("attachments", f.file));

        try {
            const res = await fetch("/api/posts/create", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Post submission failed:", res.status, text);
                return;
            }

            const result = await res.json();
            if (result.status === 200) {
                newPostContent = "";
                files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
                files = [];
                props.postSubmission(result.post);
            } else {
                console.error("Failed to create post:", result.message);
            }
        } catch (err) {
            console.error("Post submission failed:", err);
        } finally {
            isSubmitting = false;
        }
    }

    function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files) return;

        const newFiles = Array.from(input.files).map((file) => ({
            file,
            previewUrl:
                file.type.startsWith("image/") || file.type.startsWith("video/")
                    ? URL.createObjectURL(file)
                    : "",
        }));

        files = [...files, ...newFiles].slice(0, 10);
        input.value = "";
    }

    function removeFile(index: number) {
        URL.revokeObjectURL(files[index].previewUrl);
        files.splice(index, 1);
        files = [...files];
    }

    async function handleSubmit(event: Event) {
        event.preventDefault();
        if (isSubmitting) return;
        isSubmitting = true;

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        if (!newPostContent.trim()) {
            console.error("Post content is empty!");
            isSubmitting = false;
            return;
        }

        formData.set("content", newPostContent);
        files.forEach((f) => formData.append("attachments", f.file));

        try {
            const res = await fetch(form.action, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Post submission failed:", res.status, text);
                return;
            }

            const result = await res.json();
            if (result.status === 200) {
                newPostContent = "";
                files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
                files = [];
                props.postSubmission(result.post);
            } else {
                console.error("Failed to create post:", result.message);
            }
        } catch (err) {
            console.error("Post submission failed:", err);
        } finally {
            isSubmitting = false;
        }
    }
</script>

<svelte:window bind:innerWidth={screenWidth} />

{#if props.user}
    <div class="post mb-6">
        <div class="flex gap-3">
            <Avatar.Root class="flex-shrink-0">
                <a href={`/users/${props.user.username}`}>
                    <Avatar.Image
                        src={currentUserAv}
                        alt={`@${props.user.username}`}
                    />
                    <Avatar.Fallback>
                        <img src="/images/fallback-pfp.jpg" alt="" />
                    </Avatar.Fallback>
                </a>
            </Avatar.Root>

            <form class="flex-grow" onsubmit={handleSubmit}>
                <input type="hidden" name="postType" value={props.postType} />
                {#if props.postType === "reply" && props.replyParent}
                    <input
                        type="hidden"
                        name="replyParent"
                        value={props.replyParent}
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

                <!-- file previews -->
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
                                    alt=""
                                    class="object-cover w-full h-24"
                                />
                                <button
                                    type="button"
                                    onclick={() => removeFile(i)}
                                    class="absolute top-1 right-1 bg-vocal_strong hover:bg-vocal_strongest rounded-full p-1 transition"
                                    disabled={isSubmitting}
                                >
                                    <X class="size-3 text-white" />
                                </button>
                            </div>
                        {/each}
                    </div>
                {/if}

                <!-- buttons -->
                <div class="flex justify-end gap-2 mt-2">
                    <input
                        id="fileUpload"
                        type="file"
                        class="hidden"
                        accept="image/*"
                        multiple
                        onchange={handleFileChange}
                    />

                    <button
                        type="button"
                        class="bg-vocal_medium hover:bg-vocal_lightest text-white px-4 py-2 rounded-full flex items-center gap-2 transition disabled:bg-vocal_strong disabled:cursor-default"
                        disabled={isSubmitting || files.length >= 10}
                        onclick={() =>
                            document.getElementById("fileUpload")?.click()}
                    >
                        <Image class="size-5" /> Upload
                    </button>

                    <button
                        type="button"
                        class="ms-2 bg-vocal_medium hover:bg-vocal_lightest text-white px-4 py-2 rounded-full flex items-center gap-2 transition disabled:bg-vocal_strong disabled:cursor-default"
                        disabled={isSubmitting || !newPostContent.trim()}
                        onclick={submitPost}
                    >
                        <Plus class="size-5" /> Post
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
