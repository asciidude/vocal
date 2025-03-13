<script lang="ts">
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import * as Tabs from "$lib/components/ui/tabs";
    import { UserRoles } from "$lib/types/User.types";
    import {
        Ellipsis,
        HardHat,
        Heart,
        Shield,
        Sparkle,
        MessageCircle,
    } from "lucide-svelte";
    import * as Avatar from "$lib/components/ui/avatar";
    import { getImage } from "$lib/utils/Cache.util";

    import Post from "$lib/components/shared/Post.svelte";
    import Reply from "$lib/components/shared/Reply.svelte";
  
    export let data: PageData;
  
    $: user = data?.user;
    $: posts = data?.posts;
    $: follow = {
        ing: data?.following || 0,
        ers: data?.followers || 0,
    };
    let activeTab: string = "posts";
  
    const roleData = {
        [UserRoles.SuperAdmin]: {
            icon: Sparkle,
            description: "This user is a site owner",
            priority: 3
        },
        [UserRoles.Admin]: {
            icon: Shield,
            description: "This user is a site admin",
            priority: 2
        },
        [UserRoles.Beta]: {
            icon: HardHat,
            description: "This user is a beta tester",
            priority: 1
        },
    };
  
    function getInitials(name: string) {
        if (!name) return "?";
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    }

    let avatarSrc = '';
    let bannerSrc = '';

    onMount(async () => {
        avatarSrc = await getImage(data.user.avatarUrl);
        bannerSrc = await getImage(data.user.bannerUrl);

        const header = document.getElementById("profileHeader");
        header!.style.background = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bannerSrc})`;
        header!.style.backgroundRepeat = "no-repeat";
        header!.style.backgroundPosition = "center";
        header!.style.backgroundSize = "cover";
    });
</script>
  
<title>Vocal - {user.displayName || user.username}</title>

<div class="profile-container m-5">
    <div
        class="profile-header mt-5 rounded-t-lg bg-[#7056AE]"
        id="profileHeader"
    >
        <div class="profile-header-content">
            <div class="avatar-container">
                {#if user.avatarUrl}
                    <img
                        src={avatarSrc}
                        alt="{user.displayName || user.username}'s avatar"
                        class="avatar"
                    />
                {:else}
                    <div class="avatar-fallback">
                        {getInitials(user.displayName || user.username)}
                    </div>
                {/if}
            </div>
            <div class="user-info">
                <div class="name-and-badges">
                    <h1>{user.displayName || user.username}</h1>
                    <div class="badges">
                        {#each user.roles.sort((a, b) => roleData[a].priority - roleData[b].priority) as role}
                            {#if roleData[role]}
                                <Tooltip.Root>
                                    <Tooltip.Trigger>
                                        <svelte:component
                                            this={roleData[role].icon}
                                            class="w-5 h-5 mr-1 mt-1"
                                        />
                                    </Tooltip.Trigger>
                                    <Tooltip.Content>
                                        <p>{roleData[role].description}</p>
                                    </Tooltip.Content>
                                </Tooltip.Root>
                            {/if}
                        {/each}
                    </div>
                </div>
                <p class="username">@{user.username}</p>

                {#if user.bio}
                    <p class="bio">{user.bio}</p>
                {/if}

                <div class="follow-stats">
                    <a
                        href="/users/{userpost.discordId}/following"
                        class="follow-stat"
                    >
                        <span class="follow-count">{follow.ing}</span>
                        <span class="follow-label">Following</span>
                    </a>
                    <a
                        href="/users/{user.discordId}/followers"
                        class="follow-stat"
                    >
                        <span class="follow-count">{follow.ers}</span>
                        <span class="follow-label">Followers</span>
                    </a>
                </div>
            </div>
        </div>
    </div>

    <div class="profile-content pb-5">
        <Tabs.Root
            value={activeTab}
            onValueChange={(value) => (activeTab = value!.toString())}
            class="w-full"
        >
            <Tabs.List class="flex justify-center items-center bg-transparent p-5 pt-7">
                <Tabs.Trigger value="posts" class="data-[state=active]:bg-vocal_strong data-[state=active]:text-white">
                    Posts
                </Tabs.Trigger>
                <Tabs.Trigger value="replies" class="data-[state=active]:bg-vocal_strong data-[state=active]:text-white">
                    Replies
                </Tabs.Trigger>
                <Tabs.Trigger value="media" class="data-[state=active]:bg-vocal_strong data-[state=active]:text-white">
                    Media
                </Tabs.Trigger>
                <Tabs.Trigger value="likes" class="data-[state=active]:bg-vocal_strong data-[state=active]:text-white">
                    Likes
                </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="posts" class="tab-content">
                {#if posts && posts.posts.length > 0}
                    {#each posts.posts as post}
                        <Post 
                            {post}
                            postAuthor={user}
                            postLikes={posts.likes.filter((p) => p.parent_post === post._id).length}
                            postReplies={posts.postReplies.filter((p) => p.parent_post === post._id).length}
                        />
                    {/each}
                {:else}
                    <p class="empty">No posts yet.</p>
                {/if}
            </Tabs.Content>

            <Tabs.Content value="replies" class="tab-content">
                {#if posts && posts.userReplies.length > 0}
                    {#each posts.userReplies as reply}
                        <Reply 
                            {reply}
                            replyAuthor={user}
                            replyLikes={posts.likes.filter((p) => p.parent_post === reply._id).length}
                            replyReplies={posts.userReplies.filter((p) => p.parent_post === reply._id).length}
                        />
                    {/each}
                {:else}
                    <p class="empty">No replies yet.</p>
                {/if}
            </Tabs.Content>

            <Tabs.Content value="media" class="tab-content">
                <p class="empty">Media posts will be displayed here.</p>
            </Tabs.Content>

            <Tabs.Content value="likes" class="tab-content">
                <p class="empty">Liked posts will be displayed here.</p>
            </Tabs.Content>
        </Tabs.Root>
    </div>
</div>

<style>
    .profile-container {
        max-width: 70rem;
        margin: 0 auto;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
    }

    .profile-header {
        padding: 2rem;
        position: relative;
    }

    .profile-header-content {
        display: flex;
        align-items: flex-start;
        gap: 1.5rem;
    }

    .avatar-container {
        flex-shrink: 0;
    }

    .avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 4px solid #a481f6;
        object-fit: cover;
    }

    .avatar-fallback {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 4px solid #a481f6;
        background-color: #4d3882;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        font-weight: bold;
    }

    .user-info {
        color: white;
        flex-grow: 1;
    }

    .name-and-badges {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.25rem;
    }

    .user-info h1 {
        font-size: 2rem;
        margin: 0;
        font-weight: 700;
    }

    .badges {
        display: flex;
        align-items: center;
    }

    .username {
        color: #a481f6;
        font-size: 1.1rem;
        margin-bottom: 1rem;
    }

    .bio {
        line-height: 1;
    }

    .follow-stats {
        display: flex;
        gap: 1.5rem;
        margin-top: 1rem;
    }

    .follow-stat {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        color: white;
        text-decoration: none;
    }

    .follow-count {
        font-weight: 600;
    }

    .follow-label {
        color: rgba(255, 255, 255, 0.7);
    }

    .profile-content {
        background-color: rgb(23, 21, 29);
        color: white;
    }
  
    .empty {
        color: #888;
        font-style: italic;
        padding: 2rem 0;
        text-align: center;
    }

    @media (max-width: 600px) {
        .profile-header-content {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .avatar-container {
            margin-bottom: 1rem;
        }

        .user-info {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .follow-stats {
            justify-content: center;
        }
    }
</style>
