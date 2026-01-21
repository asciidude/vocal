<script lang="ts">
    import * as Select from "$lib/components/ui/select/index.js";

    export let title: string;
    export let description: string = "";
    export let href: string | undefined;
    export let options: string[] | undefined;
    export let value: string | undefined;
    export let spaceTop: boolean = true;
</script>

<div
    class={`divide-y divide-[#2d2249] rounded-lg border border-[#2d2249] overflow-hidden ${spaceTop ? "mt-3" : ""}`}
>
    {#if options && options.length}
        <Select.Root type="single" bind:value>
            <Select.Trigger
                class="w-full flex justify-between items-center px-4 py-3 text-sm font-medium text-white bg-[#171226] rounded-lg border border-1 border-vocal_strongest hover:bg-[#1c1630] transition"
            >
                <span class="truncate">{title}</span>
            </Select.Trigger>

            <Select.Content
                class="bg-[#171226] border border-[#2d2249] rounded-lg text-white shadow-lg mt-1"
            >
                {#each options as option}
                    <Select.Item
                        value={option}
                        class="px-4 py-2 cursor-pointer rounded data-[highlighted]:bg-[#2d2249] data-[highlighted]:text-white"
                    >
                        {option}
                    </Select.Item>
                {/each}
            </Select.Content>
        </Select.Root>
    {:else if href}
        <a
            {href}
            class="group flex items-center justify-between px-4 py-3 transition hover:bg-[#1c1630] rounded-lg"
        >
            <div class="flex flex-col flex-1 min-w-0">
                <span class="text-sm font-medium text-white">{title}</span>
                {#if description}
                    <span class="text-xs text-muted-foreground truncate"
                        >{description}</span
                    >
                {/if}
            </div>
            <svg
                class="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                />
            </svg>
        </a>
    {:else}
        <div class="px-4 py-3 flex items-center justify-between">
            <div class="flex flex-col flex-1 min-w-0">
                <span class="text-sm font-medium text-white">{title}</span>
                {#if description}
                    <span class="text-xs text-muted-foreground truncate"
                        >{description}</span
                    >
                {/if}
            </div>
            <div class="ml-4 flex items-center">
                <slot />
            </div>
        </div>
    {/if}
</div>
