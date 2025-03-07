<script lang="ts">
    import { onMount } from 'svelte';
  
    let isLoaded = false;
  
    const accountStatuses = [
        { level: 0, name: "Good Standing", description: "No issues" },
        { level: 1, name: "Warning", description: "User has received one or multiple warnings" },
        { level: 2, name: "Restricted", description: "User has limited access (e.g., cannot post or comment, either temporarily or permanently)" },
        { level: 3, name: "Suspended", description: "User has been temporarily banned" },
        { level: 4, name: "Banned", description: "User has been permanently banned" },
        { level: 5, name: "Under Review", description: "User's account is under investigation" }
    ];
  
    onMount(() => {
        isLoaded = true;
    });
</script>
  
<div class="min-h-screen bg-black text-gray-200 font-mono">
  <div class="main-tos container mx-auto py-12 px-4 md:px-6">
    <header class="text-center mb-12 relative">
      <h1 class="text-4xl md:text-5xl uppercase tracking-wider text-[#A481F6] glow-text">
        Terms of Service
      </h1>
      <div class="header-decoration mt-4"></div>
    </header>
    
    <div class="vocal-tos max-w-4xl mx-auto bg-black/40 backdrop-blur-sm border border-[#7056AE]/50 rounded-lg p-6 md:p-8 shadow-lg shadow-[#4D3882]/20">
      <section class="mb-8 border-l-4 border-[#A481F6] pl-4">
        <p class="text-lg">
          Welcome to Vocal! By using our platform, you agree to follow these terms and conditions. Violation of these terms may result in account restrictions or termination.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-bold text-[#A481F6] border-b border-[#7056AE] pb-2 mb-4">
          Community Guidelines
        </h2>
        
        <div class="space-y-6">
          <div class="rule-item bg-[#4D3882]/10 border-l-2 border-[#9F7DEF] p-4 rounded">
            <h3 class="text-xl font-semibold text-[#9F7DEF] mb-2">Respect & Kindness</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li>Be respectful to yourself and others at all times</li>
              <li>Be kind to others and use basic communication skills</li>
              <li>Engage with the platform in good faith; don't exploit features or disrupt the community</li>
            </ul>
          </div>
          
          <div class="rule-item bg-[#4D3882]/10 border-l-2 border-[#9F7DEF] p-4 rounded">
            <h3 class="text-xl font-semibold text-[#9F7DEF] mb-2">Content Standards</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li>Do not post harmful, inappropriate, derogatory, or hateful content</li>
              <li>No violence, threats, or encouragement of self-mutilation or harm</li>
              <li>No content encouraging eating disorders
                <ul class="list-circle pl-5 mt-2 space-y-1">
                  <li class="text-sm">Note: Content seeking genuine support for eating disorders is permitted, but content promoting unhealthy behaviors (e.g., "skinny inspo" posts) will be put under review</li>
                </ul>
              </li>
              <li>No illegal or dangerous activities</li>
              <li>No spam, scams, or misleading content</li>
              <li>No explicit or sexually inappropriate content whatsoever</li>
              <li>No "rage-baiting" or intentionally posting content designed to provoke negative emotional reactions</li>
            </ul>
          </div>
          
          <div class="rule-item bg-[#4D3882]/10 border-l-2 border-[#9F7DEF] p-4 rounded">
            <h3 class="text-xl font-semibold text-[#9F7DEF] mb-2">Privacy & Identity</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li>Respect the privacy of others and their personal information, including your own</li>
              <li>When sharing information about others, consent is required and should be documented</li>
              <li>Limit what personal information is actually being shared</li>
              <li>No impersonation or misrepresentation of yourself or others</li>
            </ul>
          </div>
          
          <div class="rule-item bg-[#4D3882]/10 border-l-2 border-[#9F7DEF] p-4 rounded">
            <h3 class="text-xl font-semibold text-[#9F7DEF] mb-2">Moderation & Enforcement</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li>Respect warnings, restrictions, and bans from moderators</li>
              <li>Any type of harassment is strictly prohibited and will result in your account being put under review, and if necessary, permanently banned from the platform</li>
              <li>Direct messages are subject to being reviewed for safety reasons
                <ul class="list-circle pl-5 mt-2 space-y-1">
                  <li class="text-sm">This information is never shared or sold outside of the person or persons assigned to the review</li>
                </ul>
              </li>
            </ul>
          </div>
          
          <div class="rule-item bg-[#4D3882]/10 border-l-2 border-[#9F7DEF] p-4 rounded">
            <h3 class="text-xl font-semibold text-[#9F7DEF] mb-2">Platform Security</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li>Report any and all bugs, vulnerabilities, or exploits to the Vocal development team</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-bold text-[#A481F6] border-b border-[#7056AE] pb-2 mb-6">
          Account Status Levels
        </h2>
        <p class="mb-4">Vocal uses the following system to indicate account standing:</p>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each accountStatuses as status}
            <div class="status-item bg-black/60 border border-[#7056AE]/40 rounded-lg p-4 transition-all hover:translate-y-1 hover:shadow-md hover:shadow-[#9072D7]/20">
              <div class="flex items-center mb-2">
                <span class="flex items-center justify-center w-8 h-8 rounded-full mr-3 font-bold text-sm status-badge level-{status.level}">
                  {status.level}
                </span>
                <h3 class="font-semibold text-lg text-[#9F7DEF]">{status.name}</h3>
              </div>
              <p class="text-sm text-gray-300">{status.description}</p>
            </div>
          {/each}
        </div>
      </section>
      
      <section class="mb-8">
        <h2 class="text-2xl font-bold text-[#A481F6] border-b border-[#7056AE] pb-2 mb-4">
          Terms Updates
        </h2>
        <p>These terms may be updated periodically. Continued use of Vocal after changes constitutes acceptance of the updated terms.</p>
      </section>
      
      <div class="retro-decoration my-8"></div>
    </div>
    
    <footer class="text-center mt-12 text-sm text-gray-500 border-t border-[#4D3882]/30 pt-4">
      <p>Vocal &copy; {new Date().getFullYear()} - All Rights Reserved</p>
    </footer>
  </div>
</div>
  
<style>
    :global(body) {
    font-family: 'IBM Plex Mono', monospace;
  }
  
  .glow-text {
    text-shadow: 0 0 5px #A481F6, 0 0 10px #9072D7;
    animation: glow 3s infinite;
  }
  
  .header-decoration {
    position: relative;
    height: 2px;
    background: linear-gradient(90deg, transparent, #9072D7, transparent);
  }
  
  .retro-decoration {
    height: 12px;
    background: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      #7056AE20 10px,
      #7056AE20 20px
    );
  }
  
  /* Status badge colors */
  .status-badge.level-0 {
    background-color: #4CAF50;
    color: #000;
  }
  
  .status-badge.level-1 {
    background-color: #FFEB3B;
    color: #000;
  }
  
  .status-badge.level-2 {
    background-color: #FF9800;
    color: #000;
  }
  
  .status-badge.level-3 {
    background-color: #FF5722;
    color: #fff;
  }
  
  .status-badge.level-4 {
    background-color: #F44336;
    color: #fff;
  }
  
  .status-badge.level-5 {
    background-color: #9C27B0;
    color: #fff;
  }
  
  /* Animation for the header */
  @keyframes glow {
    0% { text-shadow: 0 0 5px #A481F6, 0 0 10px #9072D7; }
    50% { text-shadow: 0 0 15px #A481F6, 0 0 20px #9072D7, 0 0 25px #7056AE; }
    100% { text-shadow: 0 0 5px #A481F6, 0 0 10px #9072D7; }
  }
</style>
