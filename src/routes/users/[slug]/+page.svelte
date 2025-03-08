<script lang="ts">
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import { UserRoles } from "$lib/types/User.types";
    import { Ellipsis, HardHat, Heart, Shield, Sparkle, MessageCircle } from "lucide-svelte";
    import * as Avatar from "$lib/components/ui/avatar";

    export let data: PageData;
    let user = data.user;
    let posts = data.posts;
    let follow = {
        ing: data.following,
        ers: data.followers
    };

    const roleData = {
        [UserRoles.SuperAdmin]: {
            icon: Sparkle,
            description: 'This user is a site owner'
        },
        [UserRoles.Admin]: {
            icon: Shield,
            description: 'This user is a site admin'
        },
        [UserRoles.Beta]: {
            icon: HardHat,
            description: 'This user is a beta tester'
        }
    };

    function getInitials(name: string) {
        if (!name) return "?";
        return name.split(' ').map(word => word[0]).join('').toUpperCase();
    }

    onMount(() => {
        if(
            user.bannerUrl
            && user.bannerUrl !== 'none'
        ) {
            const header = document.getElementById('profileHeader');

            header!.style.background = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${user.bannerUrl})`;
            header!.style.backgroundRepeat = 'no-repeat';
            header!.style.backgroundPosition = 'center';
            header!.style.backgroundSize = 'cover';
        }
    });
</script>

<title>Vocal - {user.displayName || user.username}</title>

<div class="profile-container mt-5">
    <div class="profile-header mt-5 rounded-t-lg" style="background-color: #7056AE;" id="profileHeader">
        <div class="profile-header-content">
            <div class="avatar-container">
                {#if user.avatarUrl}
                    <img src={user.avatarUrl} alt="{user.displayName || user.username}'s avatar" class="avatar" />
                {:else}
                    <div class="avatar-fallback">
                        {getInitials(user.displayName || user.username)}
                    </div>
                {/if}
            </div>
            <div class="user-info">
                <h1>{user.displayName || user.username}</h1>
                <div class="grid grid-cols-12">
                    {#each user.roles as role}
                        {#if roleData[role]}
                            <Tooltip.Root>
                                <Tooltip.Trigger>
                                    <svelte:component this={roleData[role].icon} class="w-4 h-4 mr-1" />
                                </Tooltip.Trigger>
                                <Tooltip.Content>
                                    <p>{roleData[role].description}</p>
                                </Tooltip.Content>
                            </Tooltip.Root>
                        {/if}
                    {/each}
                </div>
                <p class="username">@{user.username}</p>
            </div>
        </div>
    </div>
    
    <div class="profile-content">
        <div class="bio-section">
            <h2>About</h2>
            {#if user.bio}
                <p>{user.bio}</p>
            {:else}
                <p class="empty">This user hasn't added a bio yet.</p>
            {/if}
        </div>
        
        <div class="stats-section">
            <a class="stat-card" href="/users/{user.discordId}/followers">
                <span class="stat-number">{follow.ers}</span>
                <span class="stat-label">Followers</span>
            </a>
            <a class="stat-card" href="/users/{user.discordId}/following">
                <span class="stat-number">{follow.ing}</span>
                <span class="stat-label">Following</span>
            </a>
        </div>

        <div class="posts-section">
            <h2>Posts</h2>
            
            {#if posts && (posts.posts.length > 0 || posts.userReplies.length > 0)}
                {#each posts.posts as post}
                    <div class="post">
                        <div class="post-header">
                            <div class="left-section">
                                <a href="/users/{user._id}" class="flex items-center gap-2">
                                    <Avatar.Root>
                                        <Avatar.Image src="{user.avatarUrl}" alt="@{user.username}" />
                                        <Avatar.Fallback>AV</Avatar.Fallback>
                                    </Avatar.Root>
                                    <div class="username">
                                        <p class="leading-none">{user.displayName}</p>
                                        <p class="text-sm text-gray-400">@{user.username}</p>
                                    </div>
                                </a>
                            </div>
                            <Ellipsis class="" />
                        </div>
                        <div class="post-content">
                            <p>{post.content}</p>
                        </div>
                        <div class="post-bottom flex items-center gap-5 mt-2">
                            <a class="flex items-center gap-2 mt-2" href="/posts/{post._id}">
                                <MessageCircle class="size-4" />
                                <p class="size-5">{posts.postReplies.filter(p => p.parent_post === post._id).length}</p>
                            </a>
                            <a class="flex items-center gap-2 mt-2" href="/api/like/{post._id}">
                                <!-- TODO: Add liking posts-->
                                <Heart class="size-4" />
                                {console.log(posts.likes)} {console.log(posts.postReplies)}
                                <p class="size-5">{posts.likes.filter(p => p.parent_post === post._id).length}</p>
                            </a>
                        </div>
                    </div>
                {/each}
            {:else}
                <p class="empty">This user has not posted or replied to anything.</p>
            {/if}
        </div>
    </div>
</div>

<style>
    .post {
        margin-top: 1rem;
        background-color: #2a2a2a;
        border-radius: 8px;
        padding: 1.25rem;
        text-align: center;
        border: 3px solid #9072D7;
    }

    .post-content {
        text-align: left;
    }

    .post-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        width: 100%;
        padding-bottom: 10px;
    }
    
    .post-header .left-section {
        display: flex;
        align-items: center;
        gap: 10px; /* Space between avatar and username */
    }

    .post-header .username {
        flex-grow: 1;
    }

    .profile-container {
        max-width: 800px;
        margin: 0 auto;
        background-color: #1a1a1a;
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
        align-items: center;
        gap: 1.5rem;
    }
    
    .avatar-container {
        position: relative;
    }
    
    .avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 4px solid #A481F6;
        object-fit: cover;
    }
    
    .avatar-fallback {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 4px solid #A481F6;
        background-color: #4D3882;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        font-weight: bold;
    }
    
    .user-info {
        color: white;
    }
    
    .user-info h1 {
        font-size: 2rem;
        margin: 0;
        font-weight: 700;
    }
    
    .username {
        color: #A481F6;
        font-size: 1.1rem;
        margin-top: 0.25rem;
    }
    
    .profile-content {
        padding: 2rem;
        background-color: #242424;
        color: white;
    }
    
    .bio-section {
        margin-bottom: 2rem;
    }
    
    .bio-section h2 {
        color: #9F7DEF;
        font-size: 1.5rem;
        margin-bottom: 0.75rem;
        font-weight: 600;
    }
    
    .posts-section {
        margin-top: 2rem;
    }
    
    .posts-section h2 {
        color: #9F7DEF;
        font-size: 1.5rem;
        margin-bottom: 0.75rem;
        font-weight: 600;
    }
    
    .empty {
        color: #888;
        font-style: italic;
    }
    
    .stats-section {
        display: flex;
        gap: 1rem;
    }
    
    .stat-card {
        flex: 1;
        background-color: #2a2a2a;
        border-radius: 8px;
        padding: 1.25rem;
        text-align: center;
        border-left: 4px solid #9072D7;
    }
    
    .stat-number {
        display: block;
        font-size: 1.75rem;
        font-weight: 700;
        color: #A481F6;
        margin-bottom: 0.25rem;
    }
    
    .stat-label {
        color: #ccc;
        font-size: 0.9rem;
    }
    
    @media (max-width: 600px) {
        .profile-header-content {
            flex-direction: column;
            text-align: center;
        }
        
        .stats-section {
            flex-direction: column;
        }
    }
</style>