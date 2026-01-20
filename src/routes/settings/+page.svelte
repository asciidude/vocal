<script lang="ts">
  import SettingsRow from "src/lib/components/shared/SettingsRow.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  $: user = data?.user;

  const sections = [
    { id: "account", label: "Account" },
    { id: "privacy", label: "Privacy" },
    { id: "notifications", label: "Notifications" },
    { id: "content", label: "Content" },
    { id: "appearance", label: "Appearance" },
    { id: "support", label: "Support" },
  ];

  let active = "account";
  let open = false;

  $: triggerLabel = sections.find((s) => s.id === active)?.label ?? "Settings";

  function select(id: string) {
    active = id;
    open = false;
  }

  function onClickOutside(node: HTMLElement) {
    const handle = (e: MouseEvent) => {
      if (!node.contains(e.target as Node)) open = false;
    };
    document.addEventListener("mousedown", handle);
    return {
      destroy() {
        document.removeEventListener("mousedown", handle);
      },
    };
  }
</script>

<title>Vocal – Settings</title>

<header
  class="sticky top-0 z-20 bg-[#130f1b]/90 backdrop-blur border-b border-[#2d2249]"
>
  <div class="max-w-6xl mx-auto px-6 py-4">
    <h1 class="text-2xl font-semibold text-white">Settings</h1>
  </div>
</header>

<main class="max-w-6xl mx-auto px-6 py-8">
  <div class="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
    <aside class="hidden md:block space-y-1">
      {#each sections as section}
        <button
          on:click={() => (active = section.id)}
          class={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition
            ${
              active === section.id
                ? "bg-[#2d2249] text-white"
                : "text-muted-foreground hover:bg-[#1c1630]"
            }`}
        >
          {section.label}
        </button>
      {/each}
    </aside>

    <div class="md:hidden relative" use:onClickOutside>
      <button
        on:click={() => (open = !open)}
        class="w-full flex items-center justify-between rounded-lg bg-[#171226] border border-[#2d2249] px-4 py-2.5 text-sm text-white"
      >
        <span>{triggerLabel}</span>
        <svg
          class={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {#if open}
        <div
          class="absolute z-30 mt-2 w-full rounded-lg border border-[#2d2249] bg-[#171226] shadow-lg"
        >
          {#each sections as section}
            <button
              on:click={() => select(section.id)}
              class={`w-full text-left px-4 py-2 text-sm transition
                ${
                  active === section.id
                    ? "bg-[#2d2249] text-white"
                    : "text-muted-foreground hover:bg-[#1c1630]"
                }`}
            >
              {section.label}
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <section class="rounded-2xl border border-[#2d2249] bg-[#171226] p-6">
      {#if active === "account"}
        <div class="space-y-6">
          <h3
            class="text-xl font-semibold text-white mb-3 border-b border-[#2d2249]/50 pb-1"
          >
            Account Information
          </h3>

          <div class="space-y-2">
            <SettingsRow
              title="Edit profile"
              description="Change your user/display name, update your profile picture or banner."
              href="/users/edit"
            />

            <SettingsRow
              title="Change password"
              description="Manage your password. You'll receive a confirmation link by email."
              href="/users/edit"
            />

            <SettingsRow
              title="Update email"
              description="Change the email address associated with your account."
              href="/users/edit"
            />
          </div>

          <div
            class="rounded-lg border-2 border-red-400 bg-[#171226] p-4"
          >
            <p class="text-xl font-semibold text-red-400">Danger Zone</p>
            <p class="text-sm text-white">
              These actions are permanent and cannot be undone.
            </p>

            <SettingsRow
              title="Delete Account"
              description="Permanently delete your account and all associated data."
              href="/users/delete"
            />
          </div>
        </div>
      {/if}

      {#if active === "privacy"}
        <h2 class="text-xl font-semibold text-white mb-4">Privacy</h2>
        <p class="text-sm text-muted-foreground">
          Control who can see your activity and data.
        </p>
      {/if}

      {#if active === "notifications"}
        <h2 class="text-xl font-semibold text-white mb-4">Notifications</h2>
        <p class="text-sm text-muted-foreground">
          Choose how and when you receive notifications.
        </p>
      {/if}

      {#if active === "content"}
        <h2 class="text-xl font-semibold text-white mb-4">Content</h2>
        <p class="text-sm text-muted-foreground">
          Customize your feed and content preferences.
        </p>
      {/if}

      {#if active === "appearance"}
        <h2 class="text-xl font-semibold text-white mb-4">Appearance</h2>
        <p class="text-sm text-muted-foreground">
          Theme, display density, and visual preferences.
        </p>
      {/if}

      {#if active === "support"}
        <h2 class="text-xl font-semibold text-white mb-4">Support</h2>
        <p class="text-sm text-muted-foreground">
          Get help, report issues, or contact support.
        </p>
      {/if}
    </section>
  </div>
</main>
