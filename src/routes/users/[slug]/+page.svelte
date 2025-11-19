<script lang="ts">
    import { onMount, tick } from "svelte";
    import type { PageData } from "./$types";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import * as Tabs from "$lib/components/ui/tabs";
    import { UserRoles } from "$lib/types/User.types";
    import { HardHat, Shield, Sparkle, UserPlus, UserMinus, Bug } from "lucide-svelte";
    import * as Avatar from "$lib/components/ui/avatar";
    import { getImage } from "$lib/utils/Cache.util";
    import Post from "$lib/components/shared/Post.svelte";
    import { enhance } from "$app/forms";
    import CreatePost from "src/lib/components/shared/CreatePost.svelte";
  
    const { data } = $props<{ data: PageData }>();

    const user = data?.user;
    const profileUser = data?.profileUser;
    const initialPosts = data?.posts;
    let isFollowing = $state(data?.isFollowing);

    let posts = $state({
        posts: initialPosts?.posts || [],
        userReplies: initialPosts?.userReplies || [],
        media: [],
        likes: []
    });
    
    let pagination = $state({
        posts: { page: 1, isLoading: false, hasMore: true },
        replies: { page: 1, isLoading: false, hasMore: true }
    });
    
    let observer: IntersectionObserver;


    const follow = {
        ing: data?.followingCount || 0,
        ers: data?.followersCount || 0,
        ersData: data?.followers || [],
        ingData: data?.following || []
    };

    let activeTab = $state('posts');
  
    const roleData = {
        [UserRoles.SuperAdmin]: { icon: Sparkle, description: "This user is a site owner", priority: 3 },
        [UserRoles.Admin]: { icon: Shield, description: "This user is a site admin", priority: 2 },
        [UserRoles.Beta]: { icon: HardHat, description: "This user was apart of our beta program", priority: 1 },
        [UserRoles.Tester]: { icon: Bug, description: "This user is Vocal tester", priority: 1 },
    };

    let bannerSrc = '';
    let mounted = false;
    let avatarSrc = '';

    onMount(() => { 
        mounted = true;
        setupObserver();
    });

    function followUser() {
        return async ({ result }) => {
            if (result.status === 200) {
                if (result.newlyFollowed) {
                    isFollowing = true;
                    follow.ers++;
                    follow.ersData.push(user);
                } else {
                    isFollowing = false;
                    follow.ers--;
                    follow.ersData = follow.ersData.filter(u => u._id !== user?._id);
                }
            }
        };
    }

    const submitPost = (post) => {
        posts = {
            ...posts,
            posts: [{ ...post, authorObj: user }, ...posts.posts]
        };
    }

    const deletePost = (postId) => {
        posts = {
            ...posts,
            posts: posts.posts.filter(p => p._id !== postId)
        };
    }

    const deleteReply = (postId) => {
        posts = {
            ...posts,
            userReplies: posts.userReplies.filter(p => p._id !== postId)
        };
    }

    const loadMorePosts = async () => {
        if (pagination.posts.isLoading || !pagination.posts.hasMore) return;
        pagination.posts.isLoading = true;

        try {
            pagination.posts.page++;

            const existingIds = posts.posts.map(p => p._id);
            
            const response = await fetch('/api/users/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: profileUser._id,
                    page: pagination.posts.page,
                    limit: 5,
                    seenIds: existingIds,
                    postType: 'post'
                })
            });

            const result = await response.json();

            if (result.posts.length === 0) {
                pagination.posts.hasMore = false;
                return;
            }

            posts = {
                ...posts,
                posts: [...posts.posts, ...result.posts]
            };
            
        } catch (err) {
            console.error('Failed to load more posts:', err);
            pagination.posts.page--;
        } finally {
            pagination.posts.isLoading = false;
        }
    }

    const loadMoreReplies = async () => {
        if (pagination.replies.isLoading || !pagination.replies.hasMore) return;
        pagination.replies.isLoading = true;

        try {
            pagination.replies.page++;

            const existingIds = posts.userReplies.map(p => p._id);
            
            const response = await fetch('/api/users/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: profileUser._id,
                    page: pagination.replies.page,
                    limit: 5,
                    seenIds: existingIds,
                    postType: 'reply'
                })
            });

            const result = await response.json();

            if (result.replies.length === 0) {
                pagination.replies.hasMore = false;
                return;
            }

            posts = {
                ...posts,
                userReplies: [...posts.userReplies, ...result.replies]
            };
            
        } catch (err) {
            console.error('Failed to load more replies:', err);
            pagination.replies.page--;
        } finally {
            pagination.replies.isLoading = false;
        }
    }

    const setupObserver = async () => {
        await tick();
        
        observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                if (activeTab === 'posts' && !pagination.posts.isLoading && pagination.posts.hasMore) {
                    loadMorePosts();
                } else if (activeTab === 'replies' && !pagination.replies.isLoading && pagination.replies.hasMore) {
                    loadMoreReplies();
                }
            }
        }, { threshold: 0.1 });

        const sentinel = document.getElementById('sentinel');
        if (sentinel) {
            observer.observe(sentinel);
        }
    }

    $effect.pre(() => {
        if(observer) {
            observer.disconnect();
            const sentinel = document.getElementById('sentinel');
            if (sentinel) observer.observe(sentinel);
        }
    });

    $effect(() => {
        if (mounted && profileUser?.avatarUrl) {
            (async () => {
                avatarSrc = await getImage(profileUser.avatarUrl);
                bannerSrc = await getImage(profileUser.bannerUrl);
                const header = document.getElementById("profileHeader");
                if (header) {
                    header.style.background = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bannerSrc})`;
                    header.style.backgroundRepeat = "no-repeat";
                    header.style.backgroundPosition = "center";
                    header.style.backgroundSize = "cover";
                }
            })();
        }
    });
</script>

<title>Vocal - {profileUser.displayName || profileUser.username}</title>

<div class="flex flex-col min-h-screen bg-vocal_dark_bg">
    <header
        class="sticky top-0 z-10 border-b bg-gradient-to-t from-bg-vocal_strongest to-bg-vocal_strong border-[#2d2249] p-8"
        id="profileHeader"
    >
        <div class="container mx-auto flex flex-col text-center">
            <Avatar.Root
                class="w-20 h-20 rounded-full object-cover mx-auto block mb-5"
            >
                <Avatar.Image
                    src={profileUser.avatarUrl}
                    alt="@{profileUser.username}"
                />
                <Avatar.Fallback
                    >{profileUser.displayName ||
                        profileUser.username}</Avatar.Fallback
                >
            </Avatar.Root>
            <div class="flex flex-row gap-3 justify-center mt-3 text-white">
                <h1 class="text-4xl font-bold text-white">
                    {profileUser.displayName || profileUser.username}
                </h1>
                {#each profileUser.roles.sort((a, b) => roleData[a].priority - roleData[b].priority) as role}
                    {#if roleData[role]}
                        <Tooltip.Provider delayDuration={0}>
                            <Tooltip.Root>
                                <Tooltip.Trigger>
                                    {#if roleData[role].icon}
                                        {@const Icon = roleData[role].icon}
                                        <Icon class="w-5 h-5" />
                                    {/if}
                                </Tooltip.Trigger>
                                <Tooltip.Content>
                                    <p class="text-lg">
                                        {roleData[role].description}
                                    </p>
                                </Tooltip.Content>
                            </Tooltip.Root>
                        </Tooltip.Provider>
                    {/if}
                {/each}
            </div>
            <p class="text-xl text-vocal_lightest opacity-50">
                @{profileUser.username}
            </p>

            {#if user && user._id !== profileUser._id}
                <div class="mt-2 mb-2 mx-auto">
                    <form
                        action="/api/users/follow/{profileUser?._id}"
                        method="post"
                        use:enhance={followUser}
                    >
                        <button
                            class="bg-vocal_strong hover:bg-vocal_strongest text-white px-5 py-1 rounded-full flex items-center gap-2 transition-colors cursor-pointer disabled:bg-vocal_strong disabled:cursor-default"
                            type="submit"
                        >
                            {#if !isFollowing}
                                <UserPlus size={16} />
                                <span class="text-lg">Follow</span>
                            {:else}
                                <UserMinus size={16} />
                                <span class="text-lg">Unfollow</span>
                            {/if}
                        </button>
                    </form>
                </div>
            {/if}

            <p class="text-2xl text-white">{profileUser.bio}</p>

            <div
                class="text-white flex align-middle justify-center text-center gap-5 mt-2"
            >
                <Dialog.Root>
                    <Dialog.Trigger class="text-xl">
                        <span class="opacity-60">{follow.ing}</span>
                        <span class="opacity-30">Following</span>
                    </Dialog.Trigger>
                    <Dialog.Content
                        class="bg-vocal_darkest text-white border-vocal_strong"
                    >
                        <Dialog.Header>
                            <Dialog.Title class="text-2xl"
                                >{profileUser.displayName ||
                                    profileUser.username}'s following</Dialog.Title
                            >
                            <Dialog.Description>
                                {#each follow.ingData as f}
                                    <Dialog.Close>
                                        <a
                                            href="/users/{f.username}"
                                            class="flex items-center gap-2 mt-3 text-xl"
                                        >
                                            <img
                                                src={f.avatarUrl}
                                                alt={f.username}
                                                class="w-6 h-6 rounded-full"
                                            />
                                            <span
                                                >{f.displayName ||
                                                    f.username}</span
                                            >
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
                    <Dialog.Content
                        class="bg-vocal_darkest text-white border-vocal_strong"
                    >
                        <Dialog.Header>
                            <Dialog.Title class="text-2xl"
                                >{profileUser.displayName ||
                                    profileUser.username}'s followers</Dialog.Title
                            >
                            <Dialog.Description>
                                {#each follow.ersData as f}
                                    <Dialog.Close>
                                        <a
                                            href="/users/{f.username}"
                                            class="flex items-center gap-2 mt-3 text-xl"
                                        >
                                            <img
                                                src={f.avatarUrl}
                                                alt={f.username}
                                                class="w-6 h-6 rounded-full"
                                            />
                                            <span
                                                >{f.displayName ||
                                                    f.username}</span
                                            >
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

    <div class="container mx-auto flex-grow py-6">
        <Tabs.Root
            value={activeTab}
            onValueChange={(value) => (activeTab = value.toString())}
            class="w-full"
        >
            <Tabs.List
                class="flex justify-center items-center bg-transparent p-5 pt-7"
            >
                <Tabs.Trigger
                    value="posts"
                    class="data-[state=active]:bg-vocal_strong data-[state=active]:text-white text-xl mt-4"
                    >Posts</Tabs.Trigger
                >
                <Tabs.Trigger
                    value="replies"
                    class="data-[state=active]:bg-vocal_strong data-[state=active]:text-white text-xl mt-4"
                    >Replies</Tabs.Trigger
                >
                <Tabs.Trigger
                    value="media"
                    class="data-[state=active]:bg-vocal_strong data-[state=active]:text-white text-xl mt-4"
                    >Media</Tabs.Trigger
                >
                <Tabs.Trigger
                    value="likes"
                    class="data-[state=active]:bg-vocal_strong data-[state=active]:text-white text-xl mt-4"
                    >Likes</Tabs.Trigger
                >
            </Tabs.List>

            <div class="container mx-auto flex-grow py-6">
                <Tabs.Content value="posts" class="tab-content space-y-4">
                    {#if data.user && data.user._id === profileUser._id}
                        <CreatePost
                            user={data.user ?? null}
                            postSubmission={submitPost}
                            postType={"post"}
                        />
                    {/if}

                    {#if posts && posts.posts.length > 0}
                        {#each posts.posts as post}
                            <Post
                                {post}
                                postAuthor={profileUser}
                                postLikes={data.posts.likes.filter(
                                    (p) => p.parent_post === post._id,
                                )}
                                postReplies={data.posts.postReplies.filter(
                                    (p) => p.parent_post === post._id,
                                )}
                                {user}
                                postDeletion={deletePost}
                            />
                        {/each}

                        <!-- Sentinel for infinite scrolling -->
                        <div
                            id="sentinel"
                            class="h-10 flex items-center justify-center"
                        >
                            {#if pagination.posts.isLoading}
                                <div class="text-gray-400">
                                    Loading more posts...
                                </div>
                            {:else if pagination.posts.hasMore}
                                <div class="h-1"></div>
                            {:else if posts.posts.length >= 5}
                                <div class="text-gray-500 text-sm py-4">
                                    No more posts to load
                                </div>
                            {/if}
                        </div>
                    {:else if !pagination.posts.isLoading}
                        <p class="text-white text-center text-2xl">
                            No posts yet.
                        </p>
                    {/if}
                </Tabs.Content>

                <Tabs.Content value="replies" class="tab-content space-y-4">
                    {#if posts && posts.userReplies.length > 0}
                        {#each posts.userReplies as reply}
                            <Post
                                post={reply}
                                postAuthor={profileUser}
                                postLikes={data.posts.replyLikes.filter(
                                    (p) => p.parent_post === reply._id,
                                )}
                                postReplies={data.posts.nestedReplies.filter(
                                    (p) => p.parent_post === reply._id,
                                )}
                                {user}
                                reply={true}
                                postDeletion={deleteReply}
                            />
                        {/each}

                        <div
                            id="sentinel"
                            class="h-10 flex items-center justify-center"
                        >
                            {#if pagination.replies.isLoading}
                                <div class="text-gray-400">
                                    Loading more replies...
                                </div>
                            {:else if pagination.replies.hasMore}
                                <div class="h-1"></div>
                            {:else if posts.userReplies.length >= 5}
                                <div class="text-gray-500 text-sm py-4">
                                    No more replies to load
                                </div>
                            {/if}
                        </div>
                    {:else if !pagination.replies.isLoading}
                        <p class="text-white text-center text-2xl">
                            No replies yet.
                        </p>
                    {/if}
                </Tabs.Content>

                <Tabs.Content value="media" class="tab-content">
                    <p class="text-white text-center text-2xl">
                        Media posts will be displayed here.
                    </p>
                </Tabs.Content>

                <Tabs.Content value="likes" class="tab-content">
                    <p class="text-white text-center text-2xl">
                        Liked posts will be displayed here.
                    </p>
                </Tabs.Content>
            </div>
        </Tabs.Root>
    </div>
</div>
