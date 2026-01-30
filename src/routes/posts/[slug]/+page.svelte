<script lang="ts">
    import type { PageData } from "./$types";
    import Post from "$lib/components/shared/Post.svelte";
    import type { LikeType } from "$lib/types/Like.type";
    import type { ReplyType } from "$lib/types/Reply.type";
    import type { PostType } from "$lib/types/Post.type";
    import CreatePost from "src/lib/components/shared/CreatePost.svelte";

    let { data } = $props<{ data: PageData }>();

    const user = $derived(data?.user);
    const post = $derived(data?.post);
    const postAuthor = $derived(data?.author);
    const likes = $derived(data?.likes ?? []);

    let replies = $state<any[]>(data?.replies ?? []);

    const submitReply = (newReply: PostType) => {
        const replyWithAuthor = {
            ...newReply,
            replyAuthor: data?.user,
        } as any;

        // Update the replies array (creates a new array for reactivity)
        replies = [replyWithAuthor, ...replies];
    };

    const deleteReply = (replyId: string) => {
        replies = replies.filter((r) => r._id.toString() !== replyId);
    };
</script>

<title>Vocal - {postAuthor.displayName || postAuthor.username}'s post</title>

<div class="container mt-5">
    {#if post && postAuthor}
        <Post
            {post}
            {postAuthor}
            postLikes={likes.filter(
                (p: LikeType) => p.parent_post === post._id,
            )}
            postReplies={replies.filter(
                (p: ReplyType) => p.parent_post === post._id,
            )}
            {user}
            postExpanded={true}
            redirectOnDelete={"back"}
            postDeletion={()=>{}}
            reply={false}
        />

        <hr class="mt-7 mb-7 border-vocal_strongest" />

        <CreatePost
            {user}
            postSubmission={submitReply}
            postType={"reply"}
            replyParent={post._id}
        />

        {#if replies.length > 0}
            {#each replies as reply (reply._id)}
                <div class="mt-3"></div>
                <Post
                    {user}
                    post={reply}
                    postAuthor={reply.replyAuthor}
                    postLikes={reply.likes ?? []}
                    postReplies={reply.replies ?? []}
                    reply={true}
                    postDeletion={deleteReply}
                    postExpanded={false}
                    redirectOnDelete={null}
                />
            {/each}
        {:else}
            <p class="text-white text-center text-2xl">No replies yet.</p>
        {/if}
    {:else}
        <p class="text-white text-center text-2xl">Loading...</p>
    {/if}
</div>
