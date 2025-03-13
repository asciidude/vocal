<script lang="ts">
    import { 
      User, 
      Shield, 
      Bell, 
      Layout, 
      Moon, 
      Sun, 
      HelpCircle, 
      Globe, 
      ChevronRight,
      Key,
      Eye,
      MessageSquare,
      Filter,
      Languages,
      Mail,
      Activity,
      Book,
      FileText,
      AlertCircle,
      MessageCircle,
      Info,
      Lock
    } from "lucide-svelte";
    import Router, { navigate } from '../../lib/components/shared/Router.svelte';
  
    let activeSection: string = "account";
    
    let darkMode: boolean = false;

    function toggleDarkMode() {
      darkMode = !darkMode;
    }
</script>

<Router />

<div class="min-h-screen {darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-purple-600 mb-8">Settings</h1>
      
      <div class="flex flex-col md:flex-row gap-8">
        <div class="w-full md:w-1/4">
          <nav class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <ul class="space-y-2">
              <li>
                <button 
                  class="w-full text-left px-4 py-2 rounded-md flex items-center gap-3 {activeSection === 'account' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}"
                  on:click={() => activeSection = 'account'}
                >
                  <User size={18} />
                  <span>Account</span>
                </button>
              </li>
              <li>
                <button 
                  class="w-full text-left px-4 py-2 rounded-md flex items-center gap-3 {activeSection === 'privacy' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}"
                  on:click={() => activeSection = 'privacy'}
                >
                  <Shield size={18} />
                  <span>Privacy & Security</span>
                </button>
              </li>
              <li>
                <button 
                  class="w-full text-left px-4 py-2 rounded-md flex items-center gap-3 {activeSection === 'notifications' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}"
                  on:click={() => activeSection = 'notifications'}
                >
                  <Bell size={18} />
                  <span>Notifications</span>
                </button>
              </li>
              <li>
                <button 
                  class="w-full text-left px-4 py-2 rounded-md flex items-center gap-3 {activeSection === 'content' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}"
                  on:click={() => activeSection = 'content'}
                >
                  <Globe size={18} />
                  <span>Content Preferences</span>
                </button>
              </li>
              <li>
                <button 
                  class="w-full text-left px-4 py-2 rounded-md flex items-center gap-3 {activeSection === 'appearance' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}"
                  on:click={() => activeSection = 'appearance'}
                >
                  <Layout size={18} />
                  <span>Appearance</span>
                </button>
              </li>
              <li>
                <button 
                  class="w-full text-left px-4 py-2 rounded-md flex items-center gap-3 {activeSection === 'help' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}"
                  on:click={() => activeSection = 'help'}
                >
                  <HelpCircle size={18} />
                  <span>Help & Support</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
        
        <!-- Settings Content Area -->
        <div class="w-full md:w-3/4">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            
            {#if activeSection === 'account'}
              <h2 class="text-2xl font-bold text-purple-600 mb-6">Account Settings</h2>
              
              <div class="space-y-6">
                <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 class="text-lg font-medium mb-2">Profile Information</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Update your profile details and how you appear to others</p>
                  <div class="flex items-center justify-between py-2">
                    <div class="flex items-center gap-3">
                      <User size={18} class="text-purple-500" />
                      <span>Edit Profile</span>
                    </div>
                    <ChevronRight size={18} class="text-gray-400" />
                  </div>
                </div>
                
                <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 class="text-lg font-medium mb-2">Account Security</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Manage your email, password, and account verification</p>
                  <div class="flex items-center justify-between py-2">
                    <div class="flex items-center gap-3">
                      <Key size={18} class="text-purple-500" />
                      <span>Change Password</span>
                    </div>
                    <ChevronRight size={18} class="text-gray-400" />
                  </div>
                  <div class="flex items-center justify-between py-2">
                    <div class="flex items-center gap-3">
                      <Mail size={18} class="text-purple-500" />
                      <span>Update Email</span>
                    </div>
                    <ChevronRight size={18} class="text-gray-400" />
                  </div>
                </div>
                
                <div class="pb-4">
                  <h3 class="text-lg font-medium mb-2 text-red-500">Danger Zone</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Actions that will permanently affect your account</p>
                  <button class="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200">
                    Deactivate Account
                  </button>
                </div>
              </div>
            {/if}
            
            {#if activeSection === 'privacy'}
              <h2 class="text-2xl font-bold text-purple-600 mb-6">Privacy & Security</h2>
              
              <div class="space-y-6">
                <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 class="text-lg font-medium mb-2">Privacy Controls</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Manage who can see your content and interact with you</p>
                  
                  <div class="flex items-center justify-between py-2">
                    <div class="flex items-center gap-3">
                      <Eye size={18} class="text-purple-500" />
                      <span>Post Visibility</span>
                    </div>
                    <ChevronRight size={18} class="text-gray-400" />
                  </div>
                  
                  <div class="flex items-center justify-between py-2">
                    <div class="flex items-center gap-3">
                      <MessageSquare size={18} class="text-purple-500" />
                      <span>Messaging Privacy</span>
                    </div>
                    <ChevronRight size={18} class="text-gray-400" />
                  </div>
                </div>
                
                <div class="pb-4">
                  <h3 class="text-lg font-medium mb-2">Security</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Keep your account secure</p>
                  
                  <div class="flex items-center justify-between py-2">
                    <div class="flex flex-col">
                      <span class="flex items-center gap-2">
                        <Shield size={18} class="text-purple-500" />
                        Two-Factor Authentication
                      </span>
                      <span class="text-sm text-gray-500 ml-6">Secure your account with 2FA</span>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  
                  <div class="flex items-center justify-between py-2">
                    <div class="flex items-center gap-3">
                      <Activity size={18} class="text-purple-500" />
                      <span>Login Activity</span>
                    </div>
                    <ChevronRight size={18} class="text-gray-400" />
                  </div>
                </div>
              </div>
            {/if}
            
            {#if activeSection === 'notifications'}
              <h2 class="text-2xl font-bold text-purple-600 mb-6">Notifications</h2>
              
              <div class="space-y-6">
                <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 class="text-lg font-medium mb-2">Push Notifications</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Control what notifications you receive on your device</p>
                  
                  <div class="flex items-center justify-between py-2">
                    <span>Likes and Reposts</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" class="sr-only peer" checked>
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  
                  <div class="flex items-center justify-between py-2">
                    <span>Comments</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" class="sr-only peer" checked>
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  
                  <div class="flex items-center justify-between py-2">
                    <span>Mentions</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" class="sr-only peer" checked>
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  
                  <div class="flex items-center justify-between py-2">
                    <span>New Followers</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" class="sr-only peer" checked>
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
                
                <div class="pb-4">
                  <h3 class="text-lg font-medium mb-2">Email Notifications</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Control what emails you receive from Vocal</p>
                  
                  <div class="flex items-center justify-between py-2">
                    <span>Weekly Digest</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  
                  <div class="flex items-center justify-between py-2">
                    <span>Account Updates</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" class="sr-only peer" checked>
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            {/if}
            
            {#if activeSection === 'content'}
              <h2 class="text-2xl font-bold text-purple-600 mb-6">Content Preferences</h2>
              
              <div class="space-y-6">
                <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 class="text-lg font-medium mb-2">Feed Customization</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Control what you see in your feed</p>
                  
                  <div class="flex items-center justify-between py-2">
                    <div class="flex items-center gap-3">
                      <Filter size={18} class="text-purple-500" />
                      <span>Topics and Interests</span>
                    </div>
                    <ChevronRight size={18} class="text-gray-400" />
                  </div>
                  
                  <div class="flex items-center justify-between py-2">
                    <span>Show Trending Topics</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" class="sr-only peer" checked>
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
                
                <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 class="text-lg font-medium mb-2">Content Filters</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Control sensitive content in your feed</p>
                  
                  <div class="flex items-center justify-between py-2">
                    <span>Hide Sensitive Content</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" class="sr-only peer">
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
                
                <div class="pb-4">
                  <h3 class="text-lg font-medium mb-2">Language</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Manage language settings</p>
                  
                  <div class="flex items-center justify-between py-2">
                    <div class="flex items-center gap-3">
                      <Languages size={18} class="text-purple-500" />
                      <span>Display Language</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-gray-500">English</span>
                      <ChevronRight size={18} class="text-gray-400" />
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-between py-2">
                    <span>Translation Options</span>
                    <ChevronRight size={18} class="text-gray-400" />
                  </div>
                </div>
              </div>
            {/if}
            
            {#if activeSection === 'appearance'}
              <h2 class="text-2xl font-bold text-purple-600 mb-6">Appearance</h2>
              
              <div class="space-y-6">
                <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 class="text-lg font-medium mb-2">Theme</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Customize how Vocal looks for you</p>
                  
                  <div class="flex items-center gap-4 py-2">
                    <button 
                      class="flex flex-col items-center p-4 rounded-lg border-2 {!darkMode ? 'border-purple-500' : 'border-gray-200 dark:border-gray-700'} hover:border-purple-500"
                      on:click={() => darkMode = false}
                    >
                      <Sun size={24} class={!darkMode ? 'text-purple-500' : 'text-gray-500'} />
                      <span class="mt-2">Light</span>
                    </button>
                    
                    <button 
                      class="flex flex-col items-center p-4 rounded-lg border-2 {darkMode ? 'border-purple-500' : 'border-gray-200 dark:border-gray-700'} hover:border-purple-500"
                      on:click={() => darkMode = true}
                    >
                      <Moon size={24} class={darkMode ? 'text-purple-500' : 'text-gray-500'} />
                      <span class="mt-2">Dark</span>
                    </button>
                  </div>
                </div>
                
                <div class="pb-4">
                  <h3 class="text-lg font-medium mb-2">Display Options</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Adjust how content appears</p>
                  
                  <div class="flex items-center justify-between py-2">
                    <span>Font Size</span>
                    <div class="flex items-center gap-2">
                      <button class="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span class="text-sm">A</span>
                      </button>
                      <button class="w-8 h-8 rounded-full flex items-center justify-center border-2 border-purple-500">
                        <span class="text-md">A</span>
                      </button>
                      <button class="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span class="text-lg">A</span>
                      </button>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-between py-2">
                    <span>Display Density</span>
                    <div class="flex items-center gap-2">
                      <button class="px-3 py-1 rounded-full border-2 border-purple-500 text-purple-600">
                        Comfortable
                      </button>
                      <button class="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600">
                        Compact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            {/if}
            
            {#if activeSection === 'help'}
              <h2 class="text-2xl font-bold text-purple-600 mb-6">Help & Support</h2>
              
              <div class="space-y-6">
                <div class="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 class="text-lg font-medium mb-2">Support Resources</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Get the help you need</p>
                  
                  <div class="flex items-center justify-between py-2">
                    <div class="flex items-center gap-3">
                      <Book size={18} class="text-purple-500" />
                      <span>Help Center</span>
                    </div>
                    <ChevronRight size={18} class="text-gray-400" />
                  </div>
                  
                  <div class="flex items-center justify-between py-2">
                    <div class="flex items-center gap-3">
                      <FileText size={18} class="text-purple-500" />
                      <span>Community Guidelines</span>
                    </div>
                    <ChevronRight size={18} class="text-gray-400" />
                  </div>
                </div>
                
                <div class="pb-4">
                  <h3 class="text-lg font-medium mb-2">Contact Us</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">Get in touch with our team</p>
                  
                  <div class="flex items-center justify-between py-2">
                    <div class="flex items-center gap-3">
                      <AlertCircle size={18} class="text-purple-500" />
                      <span>Report a Problem</span>
                    </div>
                    <ChevronRight size={18} class="text-gray-400" />
                  </div>
                  
                  <div class="flex items-center justify-between py-2">
                    <div class="flex items-center gap-3">
                      <MessageCircle size={18} class="text-purple-500" />
                      <span>Contact Support</span>
                    </div>
                    <ChevronRight size={18} class="text-gray-400" />
                  </div>
                </div>
                
                <div class="pb-4">
                  <h3 class="text-lg font-medium mb-2">About</h3>
                  <div class="flex items-center justify-between py-2">
                    <div class="flex items-center gap-3">
                      <Info size={18} class="text-purple-500" />
                      <span>About Vocal</span>
                    </div>
                    <ChevronRight size={18} class="text-gray-400" />
                  </div>
                  
                  <div class="flex items-center justify-between py-2">
                    <div class="flex items-center gap-3">
                      <FileText size={18} class="text-purple-500" />
                      <span>Terms of Service</span>
                    </div>
                    <ChevronRight size={18} class="text-gray-400" />
                  </div>
                  
                  <div class="flex items-center justify-between py-2">
                    <div class="flex items-center gap-3">
                      <Lock size={18} class="text-purple-500" />
                      <span>Privacy Policy</span>
                    </div>
                    <ChevronRight size={18} class="text-gray-400" />
                  </div>
                </div>
              </div>
            {/if}
            
          </div>
        </div>
      </div>
    </div>
</div>
