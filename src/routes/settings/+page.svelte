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

    const navItems = [
      { icon: User, label: 'Account', section: 'account' },
      { icon: Shield, label: 'Privacy', section: 'privacy' },
      { icon: Bell, label: 'Notifications', section: 'notifications' },
      { icon: Globe, label: 'Content Preferences', section: 'content' },
      { icon: Layout, label: 'Appearance', section: 'appearance' },
      { icon: Info, label: 'Support', section: 'help' }
    ];

    let activeSection: string = "account";

    function isActive(section) {
      return activeSection === section;
    }

    export let data: PageData;
    $: user = data?.user;
</script>

<title>Vocal - Settings</title>

<header class="sticky top-0 z-10 bg-[#130f1b] border-b border-[#2d2249] p-4">
    <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-3xl font-bold text-white">Settings</h1>
    </div>
</header>

<!-- TODO: Design settings page -->