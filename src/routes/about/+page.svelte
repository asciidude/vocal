<script>
    import { Users, Shield, Lock, Globe, Server, MessageCircle, Share2, Code, RefreshCw, Network, Bell, ListChecks, Key, UserPlus, Zap } from 'lucide-svelte';
  </script>
  
  <div class="min-h-screen bg-black text-white">
    <header class="py-8 border-b border-purple-600 bg-black relative overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-1 bg-purple-600 shadow-[0_0_15px_5px_rgba(168,85,247,0.5)]"></div>
      <div class="absolute -top-20 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-purple-600 rounded-full opacity-10 blur-3xl"></div>
      
      <div class="container mx-auto px-4 relative z-10">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <h1 class="text-3xl font-bold text-purple-500 text-shadow-sm shadow-purple-600">
              Vocal
            </h1>
            <span class="ml-2 bg-purple-600 text-xs px-2 py-1 rounded-full">BETA</span>
          </div>
          <nav>
            <ul class="flex space-x-8">
              <li><a href="/" class="hover:text-purple-400">Home</a></li>
              <li><a href="/about" class="text-purple-400 border-b-2 border-purple-500">About</a></li>
              <li><a href="/features" class="hover:text-purple-400">Features</a></li>
              <li><a href="/contact" class="hover:text-purple-400">Contact</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  
    <section class="py-20 relative overflow-hidden">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-purple-600 rounded-full opacity-20 blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-800 rounded-full opacity-20 blur-3xl"></div>
      
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-3xl mx-auto p-8 bg-gray-900/50 rounded-2xl border border-purple-900/60 backdrop-blur-sm shadow-xl">
          <h2 class="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text text-center">Your Voice. Your Control.</h2>
          <p class="text-xl text-gray-300 mb-10 text-center">Vocal is a decentralized social platform that puts privacy and user autonomy at the center of your social experience.</p>
          <div class="flex justify-center gap-4">
            <button class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition shadow-lg shadow-purple-900/50">
              Join Now
            </button>
            <button class="border border-purple-600 hover:bg-purple-900 text-white font-bold py-3 px-8 rounded-lg transition shadow-lg shadow-purple-900/20">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  
    <section class="py-16 bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-16 items-center">
          <div class="p-8 rounded-xl border border-purple-800/50 shadow-lg shadow-purple-900/30 bg-black/80">
            <h3 class="text-3xl font-bold mb-6 text-purple-400">What is Vocal?</h3>
            <p class="text-gray-300 mb-4">
              Vocal is a next-generation social media platform inspired by the best of BlueSky and Mastodon, 
              built on decentralized principles that put you in control of your digital presence.
            </p>
            <p class="text-gray-300 mb-4">
              Unlike mainstream social networks that harvest your data, Vocal prioritizes privacy, 
              security, and user autonomy. Your data belongs to you and only you.
            </p>
            <p class="text-gray-300">
              We're building a community where meaningful conversations happen, 
              without algorithmic manipulation or intrusive advertising.
            </p>
          </div>
          <div class="bg-black p-8 rounded-xl border border-purple-800 shadow-lg shadow-purple-900/30">
            <div class="grid grid-cols-2 gap-8">
              <div class="flex flex-col items-center text-center">
                <div class="w-16 h-16 flex items-center justify-center bg-purple-900 rounded-full mb-4 shadow-lg shadow-purple-900/50">
                  <svelte:component this={Globe} size={24} class="text-purple-400" />
                </div>
                <h4 class="font-bold mb-2 text-purple-300">Decentralized</h4>
                <p class="text-gray-400 text-sm">No central authority controls your experience</p>
              </div>
              <div class="flex flex-col items-center text-center">
                <div class="w-16 h-16 flex items-center justify-center bg-purple-900 rounded-full mb-4 shadow-lg shadow-purple-900/50">
                  <svelte:component this={Lock} size={24} class="text-purple-400" />
                </div>
                <h4 class="font-bold mb-2 text-purple-300">Privacy-First</h4>
                <p class="text-gray-400 text-sm">Your data is encrypted and belongs to you</p>
              </div>
              <div class="flex flex-col items-center text-center">
                <div class="w-16 h-16 flex items-center justify-center bg-purple-900 rounded-full mb-4 shadow-lg shadow-purple-900/50">
                  <svelte:component this={Server} size={24} class="text-purple-400" />
                </div>
                <h4 class="font-bold mb-2 text-purple-300">Self-Hosting</h4>
                <p class="text-gray-400 text-sm">Run your own instance or join others</p>
              </div>
              <div class="flex flex-col items-center text-center">
                <div class="w-16 h-16 flex items-center justify-center bg-purple-900 rounded-full mb-4 shadow-lg shadow-purple-900/50">
                  <svelte:component this={Shield} size={24} class="text-purple-400" />
                </div>
                <h4 class="font-bold mb-2 text-purple-300">Safe & Secure</h4>
                <p class="text-gray-400 text-sm">Advanced protection against threats</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  </section>
  
    <section class="py-20">
      <div class="container mx-auto px-4">
        <h3 class="text-3xl font-bold text-center mb-16 text-purple-400">Core Features</h3>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-gray-900 p-6 rounded-lg border border-purple-900 hover:border-purple-600 transition shadow-lg shadow-purple-900/20 hover:shadow-purple-600/30 group transform hover:-translate-y-1 duration-300">
            <div class="w-12 h-12 flex items-center justify-center bg-purple-800 rounded-full mb-4 shadow-md group-hover:shadow-purple-500/50">
              <svelte:component this={Users} size={20} class="text-purple-300" />
            </div>
            <h4 class="text-xl font-bold mb-3 text-purple-300">Federation</h4>
            <p class="text-gray-400">
              Connect with users across different Vocal instances while maintaining community standards and moderation.
            </p>
          </div>
          
          <div class="bg-gray-900 p-6 rounded-lg border border-purple-900 hover:border-purple-600 transition shadow-lg shadow-purple-900/20 hover:shadow-purple-600/30 group transform hover:-translate-y-1 duration-300">
            <div class="w-12 h-12 flex items-center justify-center bg-purple-800 rounded-full mb-4 shadow-md group-hover:shadow-purple-500/50">
              <svelte:component this={MessageCircle} size={20} class="text-purple-300" />
            </div>
            <h4 class="text-xl font-bold mb-3 text-purple-300">Threaded Conversations</h4>
            <p class="text-gray-400">
              Follow complex discussions with intuitive threading that keeps conversations organized and meaningful.
            </p>
          </div>
          
          <div class="bg-gray-900 p-6 rounded-lg border border-purple-900 hover:border-purple-600 transition shadow-lg shadow-purple-900/20 hover:shadow-purple-600/30 group transform hover:-translate-y-1 duration-300">
            <div class="w-12 h-12 flex items-center justify-center bg-purple-800 rounded-full mb-4 shadow-md group-hover:shadow-purple-500/50">
              <svelte:component this={Code} size={20} class="text-purple-300" />
            </div>
            <h4 class="text-xl font-bold mb-3 text-purple-300">Open Protocol</h4>
            <p class="text-gray-400">
              Built on open standards that allow developers to create innovative tools and extensions for the platform.
            </p>
          </div>
          
          <div class="bg-gray-900 p-6 rounded-lg border border-purple-900 hover:border-purple-600 transition shadow-lg shadow-purple-900/20 hover:shadow-purple-600/30 group transform hover:-translate-y-1 duration-300">
            <div class="w-12 h-12 flex items-center justify-center bg-purple-800 rounded-full mb-4 shadow-md group-hover:shadow-purple-500/50">
              <svelte:component this={RefreshCw} size={20} class="text-purple-300" />
            </div>
            <h4 class="text-xl font-bold mb-3 text-purple-300">Data Portability</h4>
            <p class="text-gray-400">
              Easily migrate your content and connections between instances, giving you true ownership of your online presence.
            </p>
          </div>
          
          <div class="bg-gray-900 p-6 rounded-lg border border-purple-900 hover:border-purple-600 transition shadow-lg shadow-purple-900/20 hover:shadow-purple-600/30 group transform hover:-translate-y-1 duration-300">
            <div class="w-12 h-12 flex items-center justify-center bg-purple-800 rounded-full mb-4 shadow-md group-hover:shadow-purple-500/50">
              <svelte:component this={Share2} size={20} class="text-purple-300" />
            </div>
            <h4 class="text-xl font-bold mb-3 text-purple-300">Content Control</h4>
            <p class="text-gray-400">
              Define who can see your posts with granular privacy settings and content distribution controls.
            </p>
          </div>
          
          <div class="bg-gray-900 p-6 rounded-lg border border-purple-900 hover:border-purple-600 transition shadow-lg shadow-purple-900/20 hover:shadow-purple-600/30 group transform hover:-translate-y-1 duration-300">
            <div class="w-12 h-12 flex items-center justify-center bg-purple-800 rounded-full mb-4 shadow-md group-hover:shadow-purple-500/50">
              <svelte:component this={Lock} size={20} class="text-purple-300" />
            </div>
            <h4 class="text-xl font-bold mb-3 text-purple-300">End-to-End Encryption</h4>
            <p class="text-gray-400">
              Private messaging with state-of-the-art encryption keeps your conversations truly private.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-gray-900/50">
      <div class="container mx-auto px-4">
        <h3 class="text-3xl font-bold text-center mb-12 text-purple-400">Privacy-Focused Features</h3>
        
        <div class="grid md:grid-cols-4 gap-6">
          <div class="bg-black/80 p-6 rounded-lg border border-purple-800 shadow-lg text-center">
            <div class="w-12 h-12 flex items-center justify-center bg-purple-900 rounded-full mb-4 mx-auto">
              <svelte:component this={Key} size={20} class="text-purple-300" />
            </div>
            <h4 class="text-lg font-bold mb-2 text-purple-300">Encrypted Data</h4>
            <p class="text-gray-400 text-sm">All your personal data is encrypted and only you have the key.</p>
          </div>
          
          <div class="bg-black/80 p-6 rounded-lg border border-purple-800 shadow-lg text-center">
            <div class="w-12 h-12 flex items-center justify-center bg-purple-900 rounded-full mb-4 mx-auto">
              <svelte:component this={Bell} size={20} class="text-purple-300" />
            </div>
            <h4 class="text-lg font-bold mb-2 text-purple-300">Notification Control</h4>
            <p class="text-gray-400 text-sm">Fine-grained control over what notifications you receive.</p>
          </div>
          
          <div class="bg-black/80 p-6 rounded-lg border border-purple-800 shadow-lg text-center">
            <div class="w-12 h-12 flex items-center justify-center bg-purple-900 rounded-full mb-4 mx-auto">
              <svelte:component this={UserPlus} size={20} class="text-purple-300" />
            </div>
            <h4 class="text-lg font-bold mb-2 text-purple-300">Follower Approval</h4>
            <p class="text-gray-400 text-sm">Approve who can follow you and see your content.</p>
          </div>
          
          <div class="bg-black/80 p-6 rounded-lg border border-purple-800 shadow-lg text-center">
            <div class="w-12 h-12 flex items-center justify-center bg-purple-900 rounded-full mb-4 mx-auto">
              <svelte:component this={ListChecks} size={20} class="text-purple-300" />
            </div>
            <h4 class="text-lg font-bold mb-2 text-purple-300">Content Moderation</h4>
            <p class="text-gray-400 text-sm">Community-led moderation that respects free speech while preventing abuse.</p>
          </div>
        </div>
      </div>
    </section>
  
    <section class="py-20 bg-gradient-to-b from-black to-purple-950">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto bg-black/30 p-8 rounded-xl border border-purple-800/40 backdrop-blur-sm shadow-xl">
          <h3 class="text-3xl font-bold mb-6 text-purple-400 text-center">Our Vision</h3>
          <p class="text-xl text-gray-300 mb-8 text-center">
            We believe social media can be better—more humane, more private, and more focused on meaningful connections.
          </p>
          <blockquote class="border-l-4 border-purple-500 pl-4 italic text-gray-300 mb-8 bg-purple-900/10 p-4 rounded-r-lg">
            "Vocal exists to return control of the social internet to its users, creating spaces for authentic connection without surveillance or manipulation."
          </blockquote>
          <p class="text-gray-400 text-center">
            By decentralizing social media, we're creating a more resilient, diverse, and user-centric internet—one voice at a time.
          </p>
        </div>
      </div>
    </section>
  
    <section class="py-16 bg-black">
      <div class="container mx-auto px-4">
        <h3 class="text-2xl font-bold text-center mb-12 text-purple-400">Vocal By The Numbers</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="bg-gray-900 p-6 rounded-lg text-center border border-purple-900 shadow-md">
            <h4 class="text-4xl font-bold text-purple-400 mb-2">100+</h4>
            <p class="text-gray-400">Instances Worldwide</p>
          </div>
          
          <div class="bg-gray-900 p-6 rounded-lg text-center border border-purple-900 shadow-md">
            <h4 class="text-4xl font-bold text-purple-400 mb-2">0</h4>
            <p class="text-gray-400">Data Sold to Advertisers</p>
          </div>
          
          <div class="bg-gray-900 p-6 rounded-lg text-center border border-purple-900 shadow-md">
            <h4 class="text-4xl font-bold text-purple-400 mb-2">50K+</h4>
            <p class="text-gray-400">Active Users</p>
          </div>
          
          <div class="bg-gray-900 p-6 rounded-lg text-center border border-purple-900 shadow-md">
            <h4 class="text-4xl font-bold text-purple-400 mb-2">100%</h4>
            <p class="text-gray-400">User Data Control</p>
          </div>
        </div>
      </div>
    </section>
  
    <section class="py-16 bg-gray-900">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center p-8 bg-black/50 rounded-xl border border-purple-800/40 shadow-xl">
          <h3 class="text-3xl font-bold mb-6 text-purple-400">Ready to Join?</h3>
          <p class="text-xl text-gray-300 mb-8">
            Experience social media that respects your privacy and amplifies your voice.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <button class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition shadow-lg shadow-purple-900/30">
              Create Account
            </button>
            <button class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition shadow-lg">
              Explore Instances
            </button>
            <button class="border border-purple-600 hover:bg-purple-900 text-white font-bold py-3 px-8 rounded-lg transition shadow-lg shadow-purple-900/20">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  
    <footer class="py-12 border-t border-purple-900 relative">
      <div class="absolute top-0 left-0 right-0 h-px bg-purple-600 shadow-[0_0_10px_2px_rgba(168,85,247,0.3)]"></div>
      
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 class="text-xl font-bold mb-4 text-purple-400">Vocal</h4>
            <p class="text-gray-400 mb-4">
              A decentralized social platform built for privacy and meaningful connections.
            </p>
            <div class="flex space-x-4">
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <a href="https://x.com/" class="text-gray-400 hover:text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <a href="https://linkdn.com" class="text-gray-400 hover:text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <a href="https://github.com/asciidude/vocal" class="text-gray-400 hover:text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
            </div>
          </div>

          <div>
            <h5 class="font-bold mb-4 text-gray-300">Company</h5>
            <ul class="space-y-2">
              <li><a href="/about" class="text-gray-400 hover:text-purple-400">About</a></li>
              <li><a href="/blog" class="text-gray-400 hover:text-purple-400">Blog</a></li>
              <li><a href="/privacy" class="text-gray-400 hover:text-purple-400">Privacy Policy</a></li>
              <li><a href="/contact" class="text-gray-400 hover:text-purple-400">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div class="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>© 2025 Vocal. The social network that respects you.</p>
        </div>
      </div>
    </footer>
</div>
