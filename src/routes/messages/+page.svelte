<script lang="ts">
    import { MessageSquare, Send, Phone, Video, Search, MoreHorizontal, User } from 'lucide-svelte';
    
    let message = '';
    let activeChat = 0;
  
    const retro = {
      purple: {
        light: '#9D7FD6',
        main: '#7B52C4',
        dark: '#5B3A96',
        ultraDark: '#432A7C'
      }
    };
  
    const friendsList = [
      { id: 0, name: 'Jane Cooper', status: 'online', lastSeen: 'now', avatar: '/images/stock/woman-1.jpg', unread: 3 },
      { id: 1, name: 'Alex Morgan', status: 'online', lastSeen: 'now', avatar: '/images/stock/random-1.jpg', unread: 0 },
      { id: 2, name: 'Devon Lane', status: 'offline', lastSeen: '3h ago', avatar: '/images/stock/man-1.jpg', unread: 0 },
      { id: 3, name: 'Robert Fox', status: 'offline', lastSeen: '1d ago', avatar: '/images/stock/man-2.jpg', unread: 5 }
    ];
  
    const messages = [
      { id: 1, sender: 0, text: "Hey! Have you seen the new music festival lineup?", timestamp: "10:32 AM" },
      { id: 2, sender: 'me', text: "Not yet! Is it good?", timestamp: "10:33 AM" },
      { id: 3, sender: 0, text: "It's amazing! Your favorite band is headlining on Saturday.", timestamp: "10:34 AM" },
      { id: 4, sender: 'me', text: "No way! That's awesome!", timestamp: "10:36 AM" },
      { id: 5, sender: 0, text: "We should definitely try to get tickets. They go on sale tomorrow.", timestamp: "10:37 AM" },
      { id: 6, sender: 'me', text: "I'm definitely in. What time do they go on sale?", timestamp: "10:38 AM" },
      { id: 7, sender: 0, text: "10 AM sharp. They'll probably sell out fast so we should be ready.", timestamp: "10:40 AM" }
    ];
  
    function handleSendMessage() {
      if (message.trim() === '') return;
      console.log("Sending message:", message);
      message = '';
    }
  
    function handleKeyPress(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        handleSendMessage();
      }
    }

    const currentFriend = () => {
      return friendsList[activeChat];
    }
</script>
  
<title>Vocal - Messages</title>

<div class="flex h-screen bg-vocal_darkest text-gray-800">
    <!-- Sidebar - Friends List -->
    <div class="w-1/4 border-none flex flex-col bg-vocal_darkest">
      <div class="p-4" style="background-color: {retro.purple.main}">
        <h1 class="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare size={20} />
          <span>Messages</span>
        </h1>
      </div>
      
      <div class="p-3">
        <div class="relative">
          <input 
            type="text" 
            placeholder="Search conversations..." 
            class="w-full p-2 pl-8 rounded-lg border focus:outline-none focus:ring-2 border-vocal_strong focus:ring-vocal_strongest placeholder-gray-500 text-black"
          />
          <Search size={18} class="absolute left-2 top-3 text-gray-500" />
        </div>
      </div>
      
      <div class="overflow-y-auto flex-grow">
        {#each friendsList as friend}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div 
            class="flex items-center p-3 cursor-pointer hover:bg-vocal_lightest relative {activeChat === friend.id ? 'bg-vocal_lightest border-l-4 border-purple-500' : ''}"
            on:click={() => activeChat = friend.id}
          >
            <div class="relative mr-3">
              {#if friend.avatar}
                <img src={friend.avatar} alt={friend.name} class="w-12 h-12 rounded-full" />
              {:else}
                <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background-color: {retro.purple.light}">
                  <User size={24} class="text-white" />
                </div>
              {/if}
              <div class="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white {friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}"></div>
            </div>
            <div class="flex-grow">
              <h3 class="font-semibold text-white">{friend.name}</h3>
              <p class="text-sm text-gray-300">
                {friend.status === 'online' ? 'Online' : `Last seen ${friend.lastSeen}`}
              </p>
            </div>
            {#if friend.unread > 0}
              <div class="w-5 h-5 rounded-full bg-red-500 p-2 flex items-center justify-center text-white text-[8px]">
                {friend.unread}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
    
    <!-- Main Chat Area -->
    <div class="flex-grow flex flex-col">
      <div class="p-4 border-vocal_strongest flex items-center justify-between shadow-sm">
        <div class="flex items-center">
          <div class="relative mr-3">
            {#if currentFriend().avatar}
              <img src={currentFriend().avatar} alt={currentFriend().avatar} class="w-12 h-12 rounded-full" />
            {:else}
              <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background-color: {retro.purple.light}">
                <User size={20} class="text-white" />
              </div>
            {/if}
            <div class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white {currentFriend()?.status === 'online' ? 'bg-green-500' : 'bg-gray-400' }"></div>
          </div>
          <div>
            <h2 class="font-bold text-white">{currentFriend()?.name || 'Select a chat'}</h2>
            <p class="text-xs text-gray-300">{currentFriend()?.status === 'online' ? 'Online' : `Last seen ${currentFriend()?.lastSeen}`}</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button class="p-2 rounded-full hover:bg-gray-100">
            <Phone size={20} />
          </button>
          <button class="p-2 rounded-full hover:bg-gray-100">
            <Video size={20} />
          </button>
          <button class="p-2 rounded-full hover:bg-gray-100">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>
      
      <div class="flex-grow p-4 overflow-y-auto bg-vocal_darkest">
        <div class="space-y-3">
          {#each messages as msg}
            <div 
              class="flex {msg.sender === 'me' ? 'justify-end' : 'justify-start'}"
            >
              <div 
                class="max-w-xs md:max-w-md rounded-lg px-4 py-2 {
                  msg.sender === 'me' 
                    ? 'text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 rounded-bl-none'
                }"
                style={msg.sender === 'me' ? `background-color: ${retro.purple.main}` : ''}
              >
                <p>{msg.text}</p>
                <p class="text-xs mt-1 {msg.sender === 'me' ? 'text-purple-200' : 'text-gray-500'}">{msg.timestamp}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
      
      <div class="p-3">
        <div class="flex items-center bg-vocal_darkest rounded-lg overflow-hidden">
          <input
            type="text"
            bind:value={message}
            placeholder="Type a message..."
            class="flex-grow p-3 focus:outline-none placeholder-gray-500"
            on:keypress={handleKeyPress}
          />
          <button 
            on:click={handleSendMessage}
            class="p-3 text-white rounded-r-lg cursor-pointer"
            style="background-color: {retro.purple.main}"
            disabled={!message.trim()}
          >
            <Send size={25} />
          </button>
        </div>
      </div>
    </div>
</div>
