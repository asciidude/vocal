<script lang="ts">
  import { page } from '$app/stores';
  import { 
    Home, 
    User, 
    Settings, 
    Bell, 
    Bookmark, 
    Heart,
    LogOut,
    Search
  } from 'lucide-svelte';
  import { getImage } from '$lib/utils/Cache.util';
  import { onMount } from 'svelte';
  import { twemojify } from 'svelte-twemojify';
  import { derived, writable } from 'svelte/store';

  export let user: { displayName: string, username: string, avatarUrl: string, discordId: string } | null = null;
  let screenLarge = false;
  let screenWidth = 0;

  const navItems = [
    { icon: Home, label: 'Home', href: '/home' },
    { icon: User, label: 'Profile', href: `/users/${user?.discordId}` },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: Bookmark, label: 'Bookmarks', href: '/bookmarks' },
    { icon: Heart, label: 'Likes', href: '/likes' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: Search, label: 'Search', href: '/search' }
  ];
  
  onMount(async () => {
    avatarSrc = await getImage(user?.avatarUrl);
  });

  $: screenLarge = screenWidth <= 1475;

  const currentPath = derived(page, $page => $page.url.pathname);

  const isActive = (href: string) => {
    return $currentPath === href;
  };

  let avatarSrc = '';
</script>

<svelte:window bind:innerWidth={screenWidth} />

<div class="{ screenLarge ? 'w-20' : 'w-72' } z-50 fixed top-0 left-0 h-screen bg-[#110b13] border-l border-[#202225] p-4 flex flex-col text-sm overflow-y-auto">
  <div class="mb-6">
    {#if screenLarge}
      <img src="/images/vocal-icon-square.png" alt="Vocal Icon" class="rounded-full drop-shadow-md drop-shadow-indigo-500/50">
    {:else}
      <h2 class="text-lg font-bold text-white tracking-wider">Vocal</h2>
    {/if}
    {#if !screenLarge}<p class="text-xs text-purple-300 mt-2">Connect with your community</p>{/if}
  </div>

  <nav class="space-y-1">
    {#if screenLarge}
      {#each navItems as item}
        <a 
          href={item.href} 
          class="flex p-3 rounded-md transition-colors {isActive(item.href) ? 
            'bg-purple-900 text-purple-200' : 
            'text-gray-300 hover:bg-[#32353b] hover:text-purple-300'}"
        >
          <svelte:component this={item.icon} class="h-5 w-5" 
          style="margin-left: 1.3px"/>
        </a>
      {/each}
    {:else}
      {#each navItems as item}
        <a 
          href={item.href} 
          class="flex items-center p-3 rounded-md transition-colors {isActive(item.href) ? 
            'bg-purple-900 text-purple-200' : 
            'text-gray-300 hover:bg-[#32353b] hover:text-purple-300'}"
        >
          <svelte:component this={item.icon} class="h-5 w-5 mr-3" />
          <span class="tracking-wide">{item.label}</span>
        </a>
      {/each}
    {/if}
  </nav>

  <div class="mt-auto pt-4 border-t border-[#252025]">
    {#if screenLarge}
      <button class="w-full flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-[#32353b] hover:text-purple-300 hover:text-white transition-colors">
        <a href="/logout" class="tracking-wide">
          <LogOut class="h-5 w-5" style="margin-left: 1.3px" />
        </a>
      </button>
    
      <div class="flex items-center mt-4">
        <img src="{avatarSrc}" alt="Avatar" class="rounded-full ring-2 ring-purple-500" />
      </div>
    {:else}
      <div class="flex items-center gap-3 p-3">
        <img src="{avatarSrc}" alt="AV" class="h-10 w-10 rounded-sm ring-2 ring-purple-500" />
        <div>
          <p class="font-medium text-white" use:twemojify>{user?.displayName || ''}</p>
          <p class="text-xs text-purple-300">@{user?.username || null}</p>
        </div>
      </div>

      <button class="w-full flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-purple-900/40 hover:text-white transition-colors">
        <LogOut class="h-5 w-5" />
        <a href="/logout" class="tracking-wide">Logout</a>
      </button>
    {/if}
  </div>
</div>

<div class="{ screenLarge ? 'w-20' : 'w-72' }"></div>