<script lang="ts">
    import type { PageData } from "./$types";

    import Post from "$lib/components/shared/Post.svelte";

    import type { LikeType } from "$lib/types/Like.type";
    import type { ReplyType } from "$lib/types/Reply.type";

    import CreatePost from "src/lib/components/shared/CreatePost.svelte";

    export let data: PageData;

    $: user = data?.user;
    $: post = data?.post;
    $: postAuthor = data?.author;
    $: likes = data?.likes ?? [];
    $: replies = data?.replies;

    const submitReply = (reply) => {
        replies = [{ ...reply, replyAuthor: data.user }, ...replies];
    }

    const deleteReply = (replyId: string) => {
        replies = replies.filter(r => r._id !== replyId);
    };
</script>

<title>Vocal - {postAuthor.displayName || postAuthor.username}'s post</title>

<div class="container mt-5 bg-vocal_dark_bg">
    <Post
        {post}
        {postAuthor}
        postLikes={likes.filter((p: LikeType) => p.parent_post === post._id)}
        postReplies={replies?.filter(
            (p: ReplyType) => p.parent_post === post._id,
        )}
        user={data.user}
        postExpanded={true}
        redirectOnDelete={'back'}
    />

    <hr class="mt-7 mb-7 text-gray-700" />

    <CreatePost
        {user}
        postSubmission={submitReply}
    />

    {#if replies.length > 0}
        {#each replies as reply (reply._id)}
            {reply.content}
            <Post
            {user}
                post={reply}
                postAuthor={reply.replyAuthor}
                postLikes={reply.likes}
                postReplies={reply.replies}
                reply={true}
                postDeletion={deleteReply}
            />
        {/each}
    {:else}
        <p class="text-white text-center text-2xl">No replies yet.</p>
    {/if}
</div>
