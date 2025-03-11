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
      { id: 0, name: 'Sarah Johnson', status: 'online', lastSeen: 'now', avatar: null, unread: 3 },
      { id: 1, name: 'Michael Chen', status: 'online', lastSeen: 'now', avatar: null, unread: 0 },
      { id: 2, name: 'Priya Patel', status: 'offline', lastSeen: '3h ago', avatar: null, unread: 0 },
      { id: 3, name: 'James Wilson', status: 'offline', lastSeen: '1d ago', avatar: null, unread: 5 },
      { id: 4, name: 'Olivia Martinez', status: 'offline', lastSeen: '2d ago', avatar: null, unread: 0 }
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
</script>
  
<div class="flex h-screen bg-[#110b13] text-gray-800">
    <!-- Sidebar - Friends List -->
    <div class="w-1/4 border-r border-gray-200 flex flex-col" style="background-color: #110b13;">
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
            class="w-full p-2 pl-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <Search size={18} class="absolute left-2 top-3 text-gray-400" />
        </div>
      </div>
      
      <div class="overflow-y-auto flex-grow">
        {#each friendsList as friend}
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div 
            class="flex items-center p-3 cursor-pointer hover:bg-gray-100 relative {activeChat === friend.id ? 'bg-purple-50 border-l-4 border-purple-500' : ''}"
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
              <h3 class="font-semibold">{friend.name}</h3>
              <p class="text-sm text-gray-500">
                {friend.status === 'online' ? 'Online' : `Last seen ${friend.lastSeen}`}
              </p>
            </div>
            {#if friend.unread > 0}
              <div class="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                {friend.unread}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
    
    <!-- Main Chat Area -->
    <div class="flex-grow flex flex-col">
      <div class="p-4 border-b border-gray-200 flex items-center justify-between shadow-sm">
        <div class="flex items-center">
          <div class="relative mr-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: {retro.purple.light}">
              <User size={20} class="text-white" />
            </div>
            <div class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-green-500"></div>
          </div>
          <div>
            <h2 class="font-bold">{friendsList[activeChat]?.name || 'Select a chat'}</h2>
            <p class="text-xs text-gray-500">{friendsList[activeChat]?.status === 'online' ? 'Online' : `Last seen ${friendsList[activeChat]?.lastSeen}`}</p>
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
      
      <div class="flex-grow p-4 overflow-y-auto bg-gradient-to-b from-purple-50 to-white">
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
      
      <div class="p-3 border-t border-gray-200">
        <div class="flex items-center bg-[#110b13] rounded-lg border border-gray-300 overflow-hidden">
          <input
            type="text"
            bind:value={message}
            placeholder="Type a message..."
            class="flex-grow p-3 focus:outline-none"
            on:keypress={handleKeyPress}
          />
          <button 
            on:click={handleSendMessage}
            class="p-3 text-white rounded-r-lg"
            style="background-color: {retro.purple.main}"
            disabled={!message.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
</div>
