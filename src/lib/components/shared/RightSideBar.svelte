<script lang="ts">
    import { Search, TrendingUp, Users } from 'lucide-svelte';
    import { Input } from "$lib/components/ui/input";
    import { twemojify } from 'svelte-twemojify';

    // Sample trending hashtags data
    const trendingHashtags = [
      { id: 1, tag: '#svelte', count: 2543 },
      { id: 2, tag: '#webdev', count: 1982 },
      { id: 3, tag: '#typescript', count: 1456 },
      { id: 4, tag: '#tailwindcss', count: 1289 },
      { id: 5, tag: '#coding', count: 943 }
    ];
    
    // Sample followers data
    const followers = [
      { id: 1, name: 'Jane Cooper', username: '@jane_cooper', avatar: '/images/stock/woman-1.jpg' },
      { id: 2, name: 'Alex Morgan', username: '@alex_m', avatar: '/images/stock/random-1.jpg' },
      { id: 3, name: 'Devon Lane', username: '@devonlane', avatar: '/images/stock/man-1.jpg' },
      { id: 4, name: 'Robert Fox', username: '@robfox', avatar: '/images/stock/man-2.jpg' }
    ];
</script>
  
<aside class="w-78 h-screen bg-vocal_darkest border-r border-[#202225] p-4 flex flex-col overflow-y-auto font-['Press_Start_2P', 'VT323', 'Minecraft', monospace] text-sm">
    <!-- Search Bar -->
    <div class="mb-6">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="h-4 w-4 text-purple-300" />
        </div>
        <Input type="text" placeholder="Search Vocal" class="pl-10 bg-[#2f3136] border-[#202225] text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500" />
      </div>
    </div>
    
    <!-- Trending Hashtags -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-3">
        <TrendingUp class="h-5 w-5 text-purple-400" />
        <h3 class="font-bold text-white tracking-wider text-xs">TRENDING HASHTAGS</h3>
      </div>
      <ul class="space-y-3">
        {#each trendingHashtags as hashtag}
          <li class="hover:bg-[#32353b] p-2 rounded-md transition-colors">
            <a href={`/hashtag/${hashtag.tag.substring(1)}`} class="block">
              <p class="font-medium text-purple-300">{hashtag.tag}</p>
              <p class="text-xs text-gray-400">{hashtag.count.toLocaleString()} posts</p>
            </a>
          </li>
        {/each}
      </ul>
    </div>
    
    <!-- Followers -->
    <div class="mt-auto">
      <div class="flex items-center gap-2 mb-3">
        <Users class="h-5 w-5 text-purple-500" />
        <h3 class="font-bold text-white tracking-wider text-xs">PEOPLE YOU FOLLOW</h3>
      </div>
      <ul class="space-y-3">
        {#each followers as follower}
          <li class="hover:bg-[#32353b] p-2 rounded-md transition-colors">
            <a href={`/users/${follower.username}`} class="flex items-center gap-3">
              <img src={follower.avatar} alt={follower.name} class="h-8 w-8 rounded-sm ring-2 ring-purple-600" />
              <div>
                <p class="font-medium text-white" use:twemojify>{follower.name}</p>
                <p class="text-xs text-purple-300">{follower.username}</p>
              </div>
            </a>
          </li>
        {/each}
      </ul>
    </div>
</aside>
