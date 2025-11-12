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
    Search,
    Menu
  } from 'lucide-svelte';
  import { getImage } from '$lib/utils/Cache.util';
  import { onMount } from 'svelte';
  import { twemojify } from 'svelte-twemojify';
  import type { UserType } from "$lib/types/User.types";
  import { Button } from "$lib/components/ui/button/index.js";

  export let user: UserType | null = null;
  let screenLarge = false;
  let screenWidth = 0;

  $: navItems = [
    { icon: Home, label: 'Home', href: '/home' },
    { icon: User, label: 'Profile', href: `/users/${user?._id}` },
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
  $: screenSmaller = screenWidth <= 500;
  $: menuActive = false;

  let avatarSrc = '';
  let mounted = false;
  
  onMount(() => mounted = true);
  $: if (mounted && user?.avatarUrl) {
    (async () => { avatarSrc = await getImage(user.avatarUrl); })();
  }

  $: currentPath = $page.url.pathname;
  const isActive = (href: string) => currentPath === href;
</script>

<svelte:window bind:innerWidth={screenWidth} />

{#if screenSmaller}
  <Button
    class="rounded-full fixed bottom-4 right-4 z-100 opacity-50 overflow-hidden cursor-pointer bg-vocal_strong border-vocal_lightest border hover:bg-vocal_strongest"
    onclick={() => (menuActive = !menuActive)}
  >
    <Menu size={12} />
  </Button>
{/if}

<div
  class="fixed top-0 left-0 h-screen z-40 bg-[#110b13] border-r border-[#202225] p-4 flex flex-col text-sm overflow-y-auto transition-transform duration-300 transform"
  class:w-20={screenLarge}
  class:w-72={!screenLarge}
  class:translate-x-[-100%]={!menuActive && screenSmaller}
>
  <div class="mb-6">
    {#if screenLarge}
      <img src="/images/vocal-icon-square.png" alt="Vocal Icon" class="rounded-full drop-shadow-md drop-shadow-indigo-500/50">
    {:else}
      <h2 class="text-3xl font-bold text-white tracking-wider">Vocal</h2>
    {/if}
    {#if !screenLarge}<p class="text-xl text-purple-300 mt-2">Connect with your community</p>{/if}
  </div>

  <nav class="space-y-1">
    {#each navItems as item}
      <a 
        href={item.href} 
        class="flex items-center p-3 rounded-md transition-colors text-gray-300 { isActive(item.href) ? '' : 'hover:bg-[#32353b] hover:text-purple-300' }"
        class:bg-purple-900={isActive(item.href)}
        class:text-purple-200={isActive(item.href)}
      >
        <svelte:component this={item.icon} class="h-5 w-5 { screenLarge ? 'ml-0.5' : 'mr-3' }" />
        {#if !screenLarge}
          <span class="tracking-wide text-lg">{item.label}</span>
        {/if}
      </a>
    {/each}
  </nav>


  <div class="mt-auto pt-4 border-t border-[#252025]">
    {#if screenLarge}
      <button class="w-full flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-[#32353b] hover:text-purple-300 hover:text-white transition-colors">
        <a href="/logout" class="tracking-wide">
          <LogOut class="h-5 w-5" style="margin-left: 1.3px" />
        </a>
      </button>
    
      <div class="flex items-center mt-4">
        <a href="/users/{user?._id}">
          <img src="{avatarSrc}" alt="Avatar" class="rounded-full ring-2 ring-purple-500" />
        </a>
      </div>
    {:else}
      <a href="/users/{user?._id}">
        <div class="flex items-center gap-3 p-3">
          <img src="{avatarSrc}" alt="AV" class="h-10 w-10 rounded-sm ring-2 ring-purple-500" />
          <div>
            <p class="font-medium text-white text-xl" use:twemojify>{user?.displayName || ''}</p>
            <p class="text-md text-purple-300">@{user?.username || null}</p>
          </div>
        </div>
      </a>

      <button class="w-full flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-purple-900/40 hover:text-white transition-colors">
        <LogOut class="h-5 w-5" />
        <a href="/logout" class="tracking-wide text-xl">Logout</a>
      </button>
    {/if}
  </div>
</div>

<div class="{ screenSmaller ? 'hidden' : '' } { screenLarge ? 'w-20' : 'w-72' }"></div>