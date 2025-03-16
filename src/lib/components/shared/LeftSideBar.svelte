<script lang="ts">
  import { page } from '$app/stores';
  import { 
    Home, 
    User, 
    Settings, 
    MessageSquare, 
    Bell, 
    Bookmark, 
    Heart, 
    TrendingUp, 
    LogOut
  } from 'lucide-svelte';
  import { getImage } from '$lib/utils/Cache.util';
  import { onMount } from 'svelte';
  import { twemojify } from 'svelte-twemojify';
  import { derived } from 'svelte/store';

  export let user: { displayName: string, username: string, avatarUrl: string, discordId: string } | null = null;

  const navItems = [
    { icon: Home, label: 'Home', href: '/home' },
    { icon: User, label: 'Profile', href: `/users/${user?.discordId}` },
    { icon: MessageSquare, label: 'Messages', href: '/messages' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: Bookmark, label: 'Bookmarks', href: '/bookmarks' },
    { icon: Heart, label: 'Likes', href: '/likes' },
    { icon: TrendingUp, label: 'Explore', href: '/explore' },
    { icon: Settings, label: 'Settings', href: '/settings' }
  ];
  
  onMount(async () => {
    avatarSrc = await getImage(user?.avatarUrl);
  });

  const currentPath = derived(page, $page => $page.url.pathname);

  const isActive = (href: string) => {
    return $currentPath === href;
  };

  let avatarSrc = '';
</script>

<aside class="w-76 h-screen bg-[#110b13] border-l border-[#202225] p-4 flex flex-col text-sm">
  <div class="mb-6">
    <h2 class="text-lg font-bold text-white tracking-wider">VOCAL</h2>
    <p class="text-xs text-purple-300 mt-2">Connect with your community</p>
  </div>

  <nav class="space-y-1">
    {#each navItems as item}
      <a 
        href={item.href} 
        class="flex items-center gap-3 p-3 rounded-md transition-colors {isActive(item.href) ? 
          'bg-purple-900 text-purple-200' : 
          'text-gray-300 hover:bg-[#32353b] hover:text-purple-300'}"
      >
        <svelte:component this={item.icon} class="h-5 w-5" />
        <span class="tracking-wide">{item.label}</span>
      </a>
    {/each}
  </nav>

  <div class="mt-auto pt-4 border-t border-[#202225]">
    <div class="flex items-center gap-3 p-3">
      <img src="{avatarSrc}" alt="AV" class="h-10 w-10 rounded-sm ring-2 ring-purple-500" />
      <div>
        <p class="font-medium text-white" use:twemojify>{user?.displayName || ''}</p>
        <p class="text-xs text-purple-300">@{user?.username || null}</p>
      </div>
    </div>

    <button class="w-full mt-4 flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-purple-900/40 hover:text-white transition-colors">
      <LogOut class="h-5 w-5" />
      <a href="/logout" class="tracking-wide">Logout</a>
    </button>
  </div>
</aside>