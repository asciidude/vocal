<script lang="ts">
    import type { UserType } from "$lib/types/User.types";

    export let data: { user: UserType };
    let user = data.user;

    function getInitials(name: string) {
        if (!name) return "?";
        return name.split(' ').map(word => word[0]).join('').toUpperCase();
    }
</script>

<title>Vocal - {user.displayName || user.username}</title>

<div class="profile-container mt-5">
    <div class="profile-header mt-5 rounded-t-lg" style="background-color: #7056AE;">
        <div class="profile-header-content">
            <div class="avatar-container">
                {#if user.avatarUrl}
                    <img src={user.avatarUrl} alt="{user.displayName || user.username}'s avatar" class="avatar" />
                {:else}
                    <div class="avatar-fallback">
                        {getInitials(user.displayName || user.username)}
                    </div>
                {/if}
            </div>
            <div class="user-info">
                <h1>{user.displayName || user.username}</h1>
                <p class="username">@{user.username}</p>
            </div>
        </div>
    </div>
    
    <div class="profile-content">
        <div class="bio-section">
            <h2>About</h2>
            {#if user.bio}
                <p>{user.bio}</p>
            {:else}
                <p class="empty-bio">This user hasn't added a bio yet.</p>
            {/if}
        </div>
        
        <div class="stats-section">
            <a class="stat-card" href="/">
                <span class="stat-number">{user.followers ? user.followers.length : 0}</span>
                <span class="stat-label">Followers</span>
            </a>
            <a class="stat-card" href="/">
                <span class="stat-number">{user.following ? user.following.length : 0}</span>
                <span class="stat-label">Following</span>
            </a>
        </div>
    </div>
</div>

<style>
    .profile-container {
        max-width: 800px;
        margin: 0 auto;
        background-color: #1a1a1a;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
    }
    
    .profile-header {
        padding: 2rem;
        position: relative;
    }
    
    .profile-header-content {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }
    
    .avatar-container {
        position: relative;
    }
    
    .avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 4px solid #A481F6;
        object-fit: cover;
    }
    
    .avatar-fallback {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 4px solid #A481F6;
        background-color: #4D3882;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        font-weight: bold;
    }
    
    .user-info {
        color: white;
    }
    
    .user-info h1 {
        font-size: 2rem;
        margin: 0;
        font-weight: 700;
    }
    
    .username {
        color: #A481F6;
        font-size: 1.1rem;
        margin-top: 0.25rem;
    }
    
    .profile-content {
        padding: 2rem;
        background-color: #242424;
        color: white;
    }
    
    .bio-section {
        margin-bottom: 2rem;
    }
    
    .bio-section h2 {
        color: #9F7DEF;
        font-size: 1.5rem;
        margin-bottom: 0.75rem;
        font-weight: 600;
    }
    
    .empty-bio {
        color: #888;
        font-style: italic;
    }
    
    .stats-section {
        display: flex;
        gap: 1rem;
    }
    
    .stat-card {
        flex: 1;
        background-color: #2a2a2a;
        border-radius: 8px;
        padding: 1.25rem;
        text-align: center;
        border-left: 4px solid #9072D7;
    }
    
    .stat-number {
        display: block;
        font-size: 1.75rem;
        font-weight: 700;
        color: #A481F6;
        margin-bottom: 0.25rem;
    }
    
    .stat-label {
        color: #ccc;
        font-size: 0.9rem;
    }
    
    @media (max-width: 600px) {
        .profile-header-content {
            flex-direction: column;
            text-align: center;
        }
        
        .stats-section {
            flex-direction: column;
        }
    }
</style>