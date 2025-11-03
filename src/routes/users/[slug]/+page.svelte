<script lang="ts">
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import * as Tabs from "$lib/components/ui/tabs";
    
    import { UserRoles } from "$lib/types/User.types";
    import {
        HardHat,
        Shield,
        Sparkle,
        UserPlus,
        UserMinus,
    } from "lucide-svelte";
    import * as Avatar from "$lib/components/ui/avatar";
    import { getImage } from "$lib/utils/Cache.util";

    import Post from "$lib/components/shared/Post.svelte";
    import Reply from "$lib/components/shared/Reply.svelte";
  
    export let data: PageData;

    $: user = data?.user;
    $: profileUser = data?.profileUser;
    $: isFollowing = data?.isFollowing;
    $: posts = data?.posts;

    $: follow = {
        ing: data?.followingCount || 0,
        ers: data?.followersCount || 0,
        ersData: data?.followers || [],
        ingData: data?.following || []
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

    let avatarSrc = '';
    let bannerSrc = '';
    let mounted = false;

    onMount(() => {
        mounted = true;
    });

    $: if (mounted && profileUser?.avatarUrl) {
        (async () => {
            avatarSrc = await getImage(profileUser.avatarUrl);
            bannerSrc = await getImage(profileUser.bannerUrl);

            const header = document.getElementById("profileHeader");
            header!.style.background = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bannerSrc})`;
            header!.style.backgroundRepeat = "no-repeat";
            header!.style.backgroundPosition = "center";
            header!.style.backgroundSize = "cover";
        })();
    }
</script>
  
<title>Vocal - {profileUser.displayName || profileUser.username}</title>

<div class="flex flex-col min-h-screen">
    <header class="sticky top-0 z-10 bg-vocal_strong border-b border-[#2d2249] p-8" id="profileHeader">
        <div class="container mx-auto flex flex-col text-center">
            <Avatar.Root class="w-20 h-20 rounded-full object-cover mx-auto block mb-5">
                <Avatar.Image 
                    src={profileUser.avatarUrl} 
                    alt="@{profileUser.username}"
                />
                <Avatar.Fallback>
                    {profileUser.displayName || profileUser.username}
                </Avatar.Fallback>
            </Avatar.Root>
            <div class="flex flex-row gap-3 justify-center mt-3 text-white">
                <h1 class="text-4xl font-bold text-white">{profileUser.displayName || profileUser.username}</h1>
                {#each profileUser.roles.sort((a, b) => roleData[a].priority - roleData[b].priority) as role}
                    {#if roleData[role]}
                        <Tooltip.Provider delayDuration={0}>
                            <Tooltip.Root>
                                <Tooltip.Trigger>
                                    <svelte:component
                                        this={roleData[role].icon}
                                        class="w-5 h-5"
                                    />
                                </Tooltip.Trigger>
                                <Tooltip.Content>
                                    <p class="text-lg">{roleData[role].description}</p>
                                </Tooltip.Content>
                            </Tooltip.Root>
                        </Tooltip.Provider>
                    {/if}
                {/each}
            </div>
            
            <p class="text-xl text-vocal_lightest opacity-50">@{profileUser.username}</p>

            {#if user?._id && user._id !== profileUser._id}
                <div class="mt-2 mb-2 mx-auto">
                    <button class="bg-vocal_strong hover:bg-vocal_strongest text-white px-5 py-1 rounded-full flex items-center gap-2 transition-colors cursor-pointer disabled:bg-vocal_strong disabled:cursor-default" type="submit">
                        {#if isFollowing == null}
                            <UserPlus size={16} />
                            <span class="text-lg">Follow</span>
                        {:else}
                            <UserMinus size={16} />
                            <span class="text-lg">Unfollow</span>
                        {/if}
                    </button>
                </div>
            {/if}
            <p class="text-2xl text-white">{profileUser.bio}</p>
            <div class="text-white flex align-middle justify-center text-center gap-5 mt-2">
                <Dialog.Root>
                    <Dialog.Trigger class="text-xl">
                        <span class="opacity-60">{follow.ing}</span>
                        <span class="opacity-30">Following</span>
                    </Dialog.Trigger>
                    <Dialog.Content class="bg-vocal_darkest text-white border-vocal_strong">
                        <Dialog.Header>
                            <Dialog.Title class="text-2xl">{profileUser.displayName || profileUser.username}'s following</Dialog.Title>
                            <Dialog.Description>
                                {#each follow.ingData as f}
                                    <Dialog.Close>
                                        <a href="/users/{f.discordId}" class="flex items-center gap-2 mt-3 text-xl">
                                            <img src={f.avatarUrl} alt={f.username} class="w-6 h-6 rounded-full" />
                                            <span>{f.displayName || f.username}</span>
                                        </a>
                                    </Dialog.Close>
                                {/each}
                            </Dialog.Description>
                        </Dialog.Header>
                    </Dialog.Content>
                </Dialog.Root>

                <Dialog.Root>
                    <Dialog.Trigger class="text-xl">
                        <span class="opacity-60">{follow.ers}</span>
                        <span class="opacity-30">Followers</span>
                    </Dialog.Trigger>
                    <Dialog.Content class="bg-vocal_darkest text-white border-vocal_strong">
                        <Dialog.Header>
                            <Dialog.Title class="text-2xl">{profileUser.displayName || profileUser.username}'s followers</Dialog.Title>
                            <Dialog.Description>
                                {#each follow.ersData as f}
                                    <Dialog.Close>
                                        <a href="/users/{f.discordId}" class="flex items-center gap-2 mt-3 text-xl">
                                            <img src={f.avatarUrl} alt={f.username} class="w-6 h-6 rounded-full" />
                                            <span>{f.displayName || f.username}</span>
                                        </a>
                                    </Dialog.Close>
                                {/each}
                            </Dialog.Description>
                        </Dialog.Header>
                    </Dialog.Content>
                </Dialog.Root>
            </div>
        </div>
    </header>

    <div class="pb-5">
        <Tabs.Root
            value={activeTab}
            onValueChange={(value) => (activeTab = value.toString())}
            class="w-full"
        >
            <Tabs.List class="flex justify-center items-center bg-transparent p-5 pt-7">
                <Tabs.Trigger value="posts" class="data-[state=active]:bg-vocal_strong data-[state=active]:text-white text-xl mt-4">
                    Posts
                </Tabs.Trigger>
                <Tabs.Trigger value="replies" class="data-[state=active]:bg-vocal_strong data-[state=active]:text-white text-xl mt-4">
                    Replies
                </Tabs.Trigger>
                <Tabs.Trigger value="media" class="data-[state=active]:bg-vocal_strong data-[state=active]:text-white text-xl mt-4">
                    Media
                </Tabs.Trigger>
                <Tabs.Trigger value="likes" class="data-[state=active]:bg-vocal_strong data-[state=active]:text-white text-xl mt-4">
                    Likes
                </Tabs.Trigger>
            </Tabs.List>

            <div class="container mx-auto flex-grow py-6">
                <Tabs.Content value="posts" class="tab-content space-y-4">
                    {#if posts && posts.posts.length > 0}
                        {#each posts.posts as post}
                            <Post 
                                {post}
                                postAuthor={profileUser}
                                postLikes={posts.likes.filter((p) => p.parent_post === post._id).length}
                                postReplies={posts.postReplies.filter((p) => p.parent_post === post._id).length}
                                user={JSON.parse(user)}
                            />
                        {/each}
                    {:else}
                        <p class="text-white text-center text-2xl">No posts yet.</p>
                    {/if}
                </Tabs.Content>

                <Tabs.Content value="replies" class="tab-content">
                    {#if posts && posts.userReplies.length > 0}
                        {#each posts.userReplies as reply}
                            <Reply 
                                {reply}
                                replyAuthor={profileUser}
                                replyLikes={posts.likes.filter((p) => p.parent_post === reply._id).length}
                                replyReplies={posts.userReplies.filter((p) => p.parent_post === reply._id).length}
                            />
                        {/each}
                    {:else}
                        <p class="text-white text-center text-2xl">No replies yet.</p>
                    {/if}
                </Tabs.Content>

                <Tabs.Content value="media" class="tab-content">
                    <p class="text-white text-center text-2xl">Media posts will be displayed here.</p>
                </Tabs.Content>

                <Tabs.Content value="likes" class="tab-content">
                    <p class="text-white text-center text-2xl">Liked posts will be displayed here.</p>
                </Tabs.Content>
            </div>
        </Tabs.Root>
    </div>
</div>