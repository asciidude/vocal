<script lang="ts">
  import SettingsRow from "$lib/components/shared/SettingsRow.svelte";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import type { PageData } from "./$types";
  import { writable } from "svelte/store";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { toast } from "svelte-sonner";

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

  const visibilityOptions = ["Public", "Private"];
  const languageOptions = ["English", "Spanish", "French", "German"];
  let accountVisibility = "Public";
  let twoFactorEnabled = false;
  let notifLikes = false;
  let notifComments = false;
  let notifMentions = false;
  let notifFollowers = false;
  let accountUpdates = false;
  let hideSensitive = false;
  let language = "English";
  const theme = writable<"light" | "dark">("dark");

  let deleteOpen = false;
  let confirmText = "";
  let deleting = false;

  async function handleDelete() {
    if (confirmText !== "DELETE") {
      toast.error("Confirmation text is incorrect.");
      deleteOpen = false;
      return;
    }

    deleting = true;

    try {
      const res: any = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmText }),
      });

      if (!res.ok) {
        toast.error(res.message || "An error occurred.");
        return;
      }

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.");
    } finally {
      deleting = false;
    }
  }
</script>

<svelte:head>
  <title>Vocal - Settings</title>
</svelte:head>

<main class="max-w-6xl mx-auto px-6 py-8">
  <div class="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
    <aside class="hidden md:block space-y-1">
      {#each sections as section}
        <button
          on:click={() => (active = section.id)}
          class={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition
            ${active === section.id ? "bg-[#2d2249] text-white" : "text-muted-foreground hover:bg-[#1c1630]"}`}
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
            stroke-width={2}
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
              class={`w-full text-left px-4 py-2 text-sm transition ${active === section.id ? "bg-[#2d2249] text-white" : "text-muted-foreground hover:bg-[#1c1630]"}`}
            >
              {section.label}
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <section
      class="rounded-2xl border border-[#2d2249] bg-[#171226] p-6 space-y-6"
    >
      {#if active === "account"}
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
        <div class="rounded-lg border-2 border-red-400 bg-[#171226] p-4">
          <p class="text-xl font-semibold text-red-400">Danger Zone</p>
          <p class="text-sm text-white">
            These actions are permanent and cannot be undone.
          </p>
          <Dialog.Root bind:open={deleteOpen}>
            <Dialog.Trigger class="w-full">
              <SettingsRow
                title="Delete Account"
                description="Permanently delete your account and all associated data."
              />
            </Dialog.Trigger>

            <Dialog.Content
              class="max-w-md rounded-2xl border border-red-500/40 bg-[#171226] shadow-xl"
            >
              <Dialog.Header>
                <Dialog.Title class="text-red-500">Delete Account</Dialog.Title>

                <Dialog.Description class="text-sm text-muted-foreground">
                  This action is permanent and cannot be undone.
                </Dialog.Description>
              </Dialog.Header>

              <div class="space-y-4 py-4">
                <p class="text-sm text-white">
                  Type
                  <span
                    class="mx-1 rounded bg-[#2d2249] px-1.5 py-0.5 font-mono text-red-400"
                  >
                    DELETE
                  </span>
                  to confirm.
                </p>

                <input
                  bind:value={confirmText}
                  placeholder="DELETE"
                  class="w-full rounded-md border border-[#2d2249] bg-[#171226] px-3 py-2 text-white outline-none transition focus:ring-2 focus:ring-red-500"
                />
              </div>

              <Dialog.Footer class="gap-2">
                <Dialog.Close>
                  <Button
                    variant="ghost"
                    class="text-white"
                    onclick={() => (confirmText = "")}
                  >
                    Cancel
                  </Button>
                </Dialog.Close>

                <Button
                  variant="destructive"
                  disabled={confirmText !== "DELETE" || deleting}
                  onclick={handleDelete}
                >
                  {deleting ? "Deleting..." : "Delete Account"}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      {/if}

      {#if active === "privacy"}
        <h3
          class="text-xl font-semibold text-white mb-3 border-b border-[#2d2249]/50 pb-1"
        >
          Privacy Settings
        </h3>
        <div class="space-y-4">
          <SettingsRow
            title="Account Visibility"
            options={visibilityOptions}
            value={accountVisibility}
          >
            <Select.Root type="single" bind:value={accountVisibility}>
              <Select.Trigger class="w-full" />
              <Select.Content>
                {#each visibilityOptions as option}
                  <Select.Item value={option}>{option}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </SettingsRow>

          <SettingsRow
            title="Messaging Privacy"
            description="Not available yet"
          />
        </div>

        <h3
          class="text-xl font-semibold text-white mt-6 mb-3 border-b border-[#2d2249]/50 pb-1"
        >
          Security
        </h3>
        <div class="space-y-4">
          <SettingsRow
            title="Two-Factor Authentication"
            value={twoFactorEnabled ? "Enabled" : "Disabled"}
          >
            <div class="flex items-center justify-between w-full">
              <span></span>
              <Switch
                id="twofactor"
                bind:checked={twoFactorEnabled}
                class="w-10 h-6 rounded-full bg-white data-[state=checked]:bg-vocal_lightest transition-colors"
              />
            </div>
          </SettingsRow>

          <SettingsRow
            title="Login Activity"
            description="View recent logins and devices."
            href="/settings/privacy/login-activity"
          />
        </div>
      {/if}

      {#if active === "notifications"}
        <h3
          class="text-xl font-semibold text-white mb-3 border-b border-[#2d2249]/50 pb-1"
        >
          Push Notifications
        </h3>
        <SettingsRow title="Likes + Reposts" value={notifLikes ? "On" : "Off"}>
          <div class="flex items-center justify-between w-full">
            <span></span>
            <Switch
              id="notifLikes"
              bind:checked={notifLikes}
              class="w-10 h-6 rounded-full bg-white data-[state=checked]:bg-vocal_lightest transition-colors"
            />
          </div>
        </SettingsRow>

        <SettingsRow title="Comments" value={notifComments ? "On" : "Off"}>
          <div class="flex items-center justify-between w-full">
            <span></span>
            <Switch
              id="notifComments"
              bind:checked={notifComments}
              class="w-10 h-6 rounded-full bg-white data-[state=checked]:bg-vocal_lightest transition-colors"
            />
          </div>
        </SettingsRow>

        <SettingsRow title="Mentions" value={notifMentions ? "On" : "Off"}>
          <div class="flex items-center justify-between w-full">
            <span></span>
            <Switch
              id="notifMentions"
              bind:checked={notifMentions}
              class="w-10 h-6 rounded-full bg-white data-[state=checked]:bg-vocal_lightest transition-colors"
            />
          </div>
        </SettingsRow>

        <SettingsRow
          title="New Followers"
          value={notifFollowers ? "On" : "Off"}
        >
          <div class="flex items-center justify-between w-full">
            <span></span>
            <Switch
              id="notifFollowers"
              bind:checked={notifFollowers}
              class="w-10 h-6 rounded-full bg-white data-[state=checked]:bg-vocal_lightest transition-colors"
            />
          </div>
        </SettingsRow>

        <h3
          class="text-xl font-semibold text-white mt-6 mb-3 border-b border-[#2d2249]/50 pb-1"
        >
          Email Notifications
        </h3>
        <SettingsRow title="Marketing Emails" href="/mailing" />
        <SettingsRow
          title="Account Updates"
          value={accountUpdates ? "On" : "Off"}
        >
          <div class="flex items-center justify-between w-full">
            <span></span>
            <Switch
              id="accountUpdates"
              bind:checked={accountUpdates}
              class="w-10 h-6 rounded-full bg-white data-[state=checked]:bg-vocal_lightest transition-colors"
            />
          </div>
        </SettingsRow>
      {/if}

      {#if active === "content"}
        <h3
          class="text-xl font-semibold text-white mb-3 border-b border-[#2d2249]/50 pb-1"
        >
          Topics & Interests
        </h3>
        <SettingsRow
          title="Manage Topics"
          description="See liked terms and remove them."
        />

        <h3
          class="text-xl font-semibold text-white mt-6 mb-3 border-b border-[#2d2249]/50 pb-1"
        >
          Content Filters
        </h3>
        <SettingsRow
          title="Hide Sensitive Topics"
          value={hideSensitive ? "On" : "Off"}
        >
          <div class="flex items-center justify-between w-full">
            <span></span>
            <Switch
              id="hideSensitive"
              bind:checked={hideSensitive}
              class="w-10 h-6 rounded-full bg-white data-[state=checked]:bg-vocal_lightest transition-colors"
            />
          </div>
        </SettingsRow>

        <h3
          class="text-xl font-semibold text-white mt-6 mb-3 border-b border-[#2d2249]/50 pb-1"
        >
          Language
        </h3>
        <SettingsRow
          title="Display Language"
          options={languageOptions}
          value={language}
        >
          <Select.Root type="single" bind:value={language}>
            <Select.Trigger class="w-full" />
            <Select.Content>
              {#each languageOptions as option}
                <Select.Item value={option}>{option}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </SettingsRow>
      {/if}

      {#if active === "appearance"}
        <h3
          class="text-xl font-semibold text-white mb-3 border-b border-[#2d2249]/50 pb-1"
        >
          Themes
        </h3>
        <RadioGroup.Root bind:value={$theme} class="flex gap-4">
          <div class="flex flex-col items-center cursor-pointer">
            <RadioGroup.Item value="light" id="light-theme" class="sr-only" />
            <Label
              for="light-theme"
              class="flex flex-col items-center cursor-pointer"
            >
              <div
                class="w-12 h-12 rounded-lg border-2 border-[#2d2249] shadow-sm"
                style="background-color: #f9fafb"
              ></div>
              <span class="text-sm text-white mt-1">Light</span>
            </Label>
          </div>
          <div class="flex flex-col items-center cursor-pointer">
            <RadioGroup.Item value="dark" id="dark-theme" class="sr-only" />
            <Label
              for="dark-theme"
              class="flex flex-col items-center cursor-pointer"
            >
              <div
                class="w-12 h-12 rounded-lg border-2 border-[#2d2249] shadow-sm"
                style="background-color: #130f1b"
              ></div>
              <span class="text-sm text-white mt-1">Dark</span>
            </Label>
          </div>
        </RadioGroup.Root>
      {/if}

      {#if active === "support"}
        <h3
          class="text-xl font-semibold text-white mb-3 border-b border-[#2d2249]/50 pb-1"
        >
          Support
        </h3>
        <p class="text-sm text-white mb-2">
          Email us at
          <a href="mailto:support@vocal.wtf" class="underline text-blue-400"
            >support@vocal.wtf</a
          >
          for help.
        </p>
        <p class="text-sm text-white">
          Or join our
          <a
            href="https://discord.gg/4Rwr2pu2bW"
            class="underline text-blue-400">Discord</a
          >
          community.
        </p>
      {/if}
    </section>
  </div>
</main>
