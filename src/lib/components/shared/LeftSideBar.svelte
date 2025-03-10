<script lang="ts">
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
   
    const navItems = [
      { icon: Home, label: 'Home', href: '/' },
      { icon: User, label: 'Profile', href: '/profile' },
      { icon: MessageSquare, label: 'Messages', href: '/messages' },
      { icon: Bell, label: 'Notifications', href: '/notifications' },
      { icon: Bookmark, label: 'Bookmarks', href: '/bookmarks' },
      { icon: Heart, label: 'Likes', href: '/likes' },
      { icon: TrendingUp, label: 'Explore', href: '/explore' },
      { icon: Settings, label: 'Settings', href: '/settings' }
    ];
  
    let currentPath = '/';
  
    const isActive = (href: string) => currentPath === href;
</script>
  
<aside class="w-64 h-screen bg-[#110b13] border-l border-[#202225] p-4 flex flex-col text-sm">
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
        <img src="/api/placeholder/40/40" alt="User Profile" class="h-10 w-10 rounded-sm ring-2 ring-purple-500" />
        <div>
          <p class="font-medium text-white">Your Name</p>
          <p class="text-xs text-purple-300">@username</p>
        </div>
      </div>

      <button class="w-full mt-4 flex items-center gap-3 p-3 rounded-md text-gray-300 hover:bg-purple-900/40 hover:text-white transition-colors">
        <LogOut class="h-5 w-5" />
        <span class="tracking-wide">Logout</span>
      </button>
    </div>
</aside>
