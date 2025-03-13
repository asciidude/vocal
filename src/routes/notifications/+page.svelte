<script lang="ts">
    type NotificationType = 'like' | 'comment' | 'follow' | 'mention' | 'repost';
    
    interface Notification {
      id: string;
      type: NotificationType;
      isRead: boolean;
      timestamp: Date;
      actor: {
        id: string;
        username: string;
        displayName: string;
        avatarUrl: string;
      };
      content?: {
        text?: string;
        postId?: string;
      };
    }
    
    let notifications: Notification[] = [
      {
        id: '1',
        type: 'like',
        isRead: false,
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        actor: {
          id: 'user123',
          username: 'techguru',
          displayName: 'Tech Guru',
          avatarUrl: '/images/stock/woman-1.jpg'
        },
        content: {
          postId: 'post456'
        }
      },
      {
        id: '2',
        type: 'comment',
        isRead: false,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        actor: {
          id: 'user234',
          username: 'designmaster',
          displayName: 'Design Master',
          avatarUrl: '/images/stock/man-2.jpg'
        },
        content: {
          text: 'Great insights! Id love to collaborate on future projects.',
          postId: 'post789'
        }
      },
      {
        id: '3',
        type: 'follow',
        isRead: true,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        actor: {
          id: 'user345',
          username: 'creativeminds',
          displayName: 'Creative Minds',
          avatarUrl: '/images/stock/man-1.jpg'
        }
      },
      {
        id: '4',
        type: 'mention',
        isRead: true,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        actor: {
          id: 'user456',
          username: 'codehacker',
          displayName: 'Code Hacker',
          avatarUrl: '/images/stock/man-1.jpg'
        },
        content: {
          text: 'Hey @username, check out this new framework!',
          postId: 'post101'
        }
      },
      {
        id: '5',
        type: 'repost',
        isRead: true,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        actor: {
          id: 'user567',
          username: 'trendsetter',
          displayName: 'Trend Setter',
          avatarUrl: '/images/stock/random-1.jpg'
        },
        content: {
          postId: 'post202'
        }
      }
    ];
    
    let filter: 'all' | 'unread' = 'all';
    
    function formatTimestamp(date: Date): string {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) {
        return `${diffInSeconds}s`;
      } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)}m`;
      } else if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)}h`;
      } else {
        return `${Math.floor(diffInSeconds / 86400)}d`;
      }
    }
    
    $: filteredNotifications = filter === 'all' 
      ? notifications 
      : notifications.filter(n => !n.isRead);
    
    function getNotificationIcon(type: NotificationType): string {
      switch (type) {
        case 'like': return 'heart';
        case 'comment': return 'message-circle';
        case 'follow': return 'user-plus';
        case 'mention': return 'at-sign';
        case 'repost': return 'repeat';
        default: return 'bell';
      }
    }
    
    function getNotificationText(notification: Notification): string {
      switch (notification.type) {
        case 'like':
          return `${notification.actor.displayName} liked your post`;
        case 'comment':
          return `${notification.actor.displayName} commented on your post: "${notification.content?.text?.substring(0, 50)}${notification.content?.text && notification.content.text.length > 50 ? '...' : ''}"`;
        case 'follow':
          return `${notification.actor.displayName} started following you`;
        case 'mention':
          return `${notification.actor.displayName} mentioned you in a post`;
        case 'repost':
          return `${notification.actor.displayName} reposted your post`;
        default:
          return '';
      }
    }
    
    function markAsRead(id: string) {
      notifications = notifications.map(notification => {
        if (notification.id === id) {
          return { ...notification, isRead: true };
        }
        return notification;
      });
    }
    
    function markAllAsRead() {
      notifications = notifications.map(notification => ({ ...notification, isRead: true }));
    }
</script>

<div class="min-h-screen bg-vocal_darkest text-white">
    <div class="container max-w-2xl mx-auto p-4">
      <header class="mb-6">
        <h1 class="text-2xl font-bold text-vocal_light mb-4">Notifications</h1>
        <div class="inline-flex bg-vocal_strong bg-opacity-20 rounded p-1">
          <button 
            class="px-4 py-2 text-sm font-medium transition-colors 
                  {filter === 'all' ? 'bg-vocal_medium text-white rounded' : 'text-vocal_light'}"
            on:click={() => filter = 'all'}
          >
            All
          </button>
          <button 
            class="px-4 py-2 text-sm font-medium transition-colors 
                  {filter === 'unread' ? 'bg-vocal_medium text-white rounded' : 'text-vocal_light'}"
            on:click={() => filter = 'unread'}
          >
            Unread
          </button>
          <button 
            class="px-4 py-2 text-sm font-medium transition-colors 
                  text-vocal_light hover:text-white"
            on:click={markAllAsRead}
          >
            Mark all read
          </button>
        </div>
      </header>
      
      <div class="space-y-4">
        {#if filteredNotifications.length === 0}
          <div class="flex flex-col items-center justify-center h-64 text-center">
            <svg class="w-16 h-16 mb-4 text-vocal_medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <p class="text-lg font-medium text-vocal_medium">No notifications yet</p>
            <p class="text-sm text-vocal_light mt-2">When you get notifications, they'll show up here</p>
          </div>
        {:else}
          {#each filteredNotifications as notification (notification.id)}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div 
              class="p-4 rounded-lg transition-colors {notification.isRead ? 'bg-vocal_darkest' : 'bg-opacity-20 bg-vocal_strong'} hover:bg-vocal_strong hover:bg-opacity-20"
              on:click={() => markAsRead(notification.id)}
            >
              <div class="flex items-start">
                <div class="flex-shrink-0 mr-4">
                  <div class="relative">
                    <img
                      src={notification.actor.avatarUrl} 
                        alt={notification.actor.displayName} 
                        class="w-12 h-12 rounded-full object-cover border-2 border-vocal_medium"
                    />
                    <div class="absolute -bottom-1 -right-1 p-1 rounded-full bg-vocal_darkest">
                      <svg class="w-4 h-4 text-vocal_light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={
                          notification.type === 'like' ? "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" :
                          notification.type === 'comment' ? "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" :
                          notification.type === 'follow' ? "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" :
                          notification.type === 'mention' ? "M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" :
                          "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        }></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start">
                    <p class="font-medium">
                      <span class="text-vocal_lightest">@{notification.actor.username}</span>
                    </p>
                    <div class="flex items-center">
                      {#if !notification.isRead}
                        <span class="h-2 w-2 bg-vocal_light rounded-full mr-2"></span>
                      {/if}
                      <span class="text-xs text-vocal_light">{formatTimestamp(notification.timestamp)}</span>
                    </div>
                  </div>
                  <p class="mt-1 text-sm">{getNotificationText(notification)}</p>
                  {#if notification.type === 'comment' && notification.content?.text}
                    <div class="mt-2 p-3 rounded bg-vocal_darkest bg-opacity-50 text-xs">
                      {notification.content.text}
                    </div>
                  {/if}
                  <div class="mt-2 flex">
                    {#if notification.type !== 'follow'}
                      <a href={`/post/${notification.content?.postId}`} class="text-xs font-medium text-vocal_light hover:text-vocal_lightest">
                        View post →
                      </a>
                    {:else}
                      <a href={`/profile/${notification.actor.username}`} class="text-xs font-medium text-vocal_light hover:text-vocal_lightest">
                        View profile →
                      </a>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
</div>
