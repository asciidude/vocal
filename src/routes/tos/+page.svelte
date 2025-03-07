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
  
<title>Vocal - Terms of Service</title>

<div class="min-h-screen bg-black text-gray-200 font-mono">
  <div class="main-tos container mx-auto py-12 px-4 md:px-6">
    <header class="text-center mb-12 relative">
      <h1 class="text-4xl md:text-5xl uppercase tracking-wider text-vocal_lightest glow-text">
        Terms of Service
      </h1>
      <div class="header-decoration mt-4"></div>
    </header>
    
    <div class="vocal-tos max-w-4xl mx-auto bg-black/40 backdrop-blur-sm border border-vocal_strong/50 rounded-lg p-6 md:p-8 shadow-lg shadow-[#4D3882]/20">
      <section class="mb-8 border-l-4 border-vocal_lightest pl-4">
        <p class="text-lg">
          Welcome to Vocal! By using our platform, you agree to follow these terms and conditions. Violation of these terms may result in disciplinary action being taken.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-bold text-vocal_lightest border-b border-vocal_strong pb-2 mb-4">
          Community Guidelines
        </h2>
        
        <div class="space-y-6">
          <div class="rule-item bg-[#4D3882]/10 border-l-2 border-vocal_light p-4 rounded">
            <h3 class="text-xl font-semibold text-vocal_light mb-2">Respect & Kindness</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li>Be respectful to yourself and others at all times</li>
              <li>Be kind to others and use basic communication skills</li>
              <li>Engage with the platform in good faith; don't exploit features or disrupt the community</li>
            </ul>
          </div>
          
          <div class="rule-item bg-[#4D3882]/10 border-l-2 border-vocal_light p-4 rounded">
            <h3 class="text-xl font-semibold text-vocal_light mb-2">Content Standards</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li>Do not post harmful, inappropriate, derogatory, or hateful content.</li>
              <li>No violence, threats, or encouragement of self-mutilation or harm to others.</li>
              <li>No content promoting unhealthy behaviors.
                <ul class="list-disc pl-5 mt-2 space-y-1">
                  <li class="text-sm">Content seeking genuine support is permitted, but content promoting unhealthy behaviors (e.g., "skinny inspo" posts) will be deleted and the posting account put Under Review.</li>
                </ul>
              </li>
              <li>No illegal or dangerous activities.</li>
              <li>No spam, scams, or misleading content.</li>
              <li>No explicit or sexually inappropriate content whatsoever.
                <ul class="list-disc pl-5 mt-2 space-y-1">
                  <li class="text-sm">Any sexually suggestive posts will be removed from our platform. By posting this content, you may recieve a warning or further action may be taken.</li>
                </ul>
              </li>
              <li>No "rage-baiting" or intentionally posting content designed to provoke negative emotional reactions.</li>
              <li>No political content, included but not limited to:
                <ul class="list-disc pl-5 mt-2 space-y-1">
                  <li class="text-sm">Discussion, posts, or content related to political topics, parties, elections, government policies, or political movements.</li>
                  <li class="text-sm">Advocacy, endorsements, or criticism of political figures or ideologies.</li>
                </ul>
              </li>
            </ul>
          </div>
          
          <div class="rule-item bg-[#4D3882]/10 border-l-2 border-vocal_light p-4 rounded">
            <h3 class="text-xl font-semibold text-vocal_light mb-2">Privacy & Identity</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li>Respect the privacy of others and their personal information, including your own.</li>
              <li>When sharing information about others, consent is required and should be documented.</li>
              <li>Limit what personal information is actually being shared.
                <ul class="list-disc pl-5 mt-2 space-y-1">
                  <li class="text-sm">Avoid sharing sensitive data such as full names (e.g., John H. Doe), addresses, phone numbers, emails, government-issued forms of identification, financial details, or other personally identifiable information (PII).</li>
                  <li class="text-sm">Consider the necessity and specifics provided by the other user of sharing any information before posting or transmitting it.</li>
                  <li class="text-sm">Anonymize or redact information when possible to protect privacy.</li>
                </ul>
              </li>
              <li>No impersonation or misrepresentation of yourself or others.</li>
              <li>To review our privacy policy, please <a href="/privacy" class="text-vocal_light">click here</a>.</li>
            </ul>
          </div>
          
          <div class="rule-item bg-[#4D3882]/10 border-l-2 border-vocal_light p-4 rounded">
            <h3 class="text-xl font-semibold text-vocal_light mb-2">Moderation & Enforcement</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li>Respect warnings, restrictions, and bans from moderators.</li>
              <li>Any type of harassment is strictly prohibited and will result in your account being put under review, and if necessary, permanently banned from the platform.</li>
              <li>Direct messages are subject to being reviewed for safety reasons.
                <ul class="list-disc pl-5 mt-2 space-y-1">
                  <li class="text-sm">This information is never shared or sold. The only people who see this information is the person or persons assigned to the review, along with anyone else in the Vocal team that needs to see it, such as the site owner.</li>
                </ul>
              </li>
            </ul>
          </div>
          
          <div class="rule-item bg-[#4D3882]/10 border-l-2 border-vocal_light p-4 rounded">
            <h3 class="text-xl font-semibold text-vocal_light mb-2">Platform Security</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li>Report any and all bugs, vulnerabilities, or exploits to the Vocal development team.</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-bold text-vocal_lightest border-b border-vocal_strong pb-2 mb-6">
          Account Status Levels
        </h2>
        <p class="mb-4">Vocal uses the following system to indicate account standing:</p>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each accountStatuses as status}
            <div class="status-item bg-black/60 border border-vocal_strong/40 rounded-lg p-4 transition-all hover:translate-y-1 hover:shadow-md hover:shadow-vocal_medium/20">
              <div class="flex items-center mb-2">
                <span class="flex items-center justify-center w-8 h-8 rounded-full mr-3 font-bold text-sm status-badge level-{status.level}">
                  {status.level}
                </span>
                <h3 class="font-semibold text-lg text-vocal_light">{status.name}</h3>
              </div>
              <p class="text-sm text-gray-300">{status.description}</p>
            </div>
          {/each}
        </div>
      </section>
      
      <section class="mb-8">
        <h2 class="text-2xl font-bold text-vocal_lightest border-b border-vocal_strong pb-2 mb-4">
          Contact
        </h2>
        <p>You may contact the site owner through the following means:</p>
        <ul class="list-disc pl-5 space-y-2 mt-2">
          <li>Discord: @asciidude <span class="font-bold">OR</span> the <a href="https://discord.gg/4Rwr2pu2bW" class="text-vocal_light">Vocal Discord server</a></li>
          <li>Email: <a href="mailto:asciidude0@gmail.com" class="text-vocal_light">asciidude0@gmail.com</a></li>
        </ul>
      </section>
      
      <section class="mb-8">
        <h2 class="text-2xl font-bold text-vocal_lightest border-b border-vocal_strong pb-2 mb-4">
          Terms Updates
        </h2>
        <p>These terms may be updated periodically. Continued use of Vocal after changes constitutes acceptance of the updated terms.</p>
        <p class="text-gray-500 mt-2 italic">Last Updated: 03-07-2025</p>
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
      #c3aaff20 10px,
      #c3aaff20 20px
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
