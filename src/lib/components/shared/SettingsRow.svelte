<script lang="ts">
    export let title: string;
    export let description: string = "";
    export let href: string;
    export let spaceTop: boolean = true;
</script>

<div
    class={`divide-y divide-[#2d2249] rounded-lg border border-[#2d2249] overflow-hidden ${spaceTop ? 'mt-3' : ''}`}
>
    <a
        {href}
        class="group flex items-center justify-between px-4 py-3 transition hover:bg-[#1c1630]"
    >
        <div class="flex flex-col">
            <span class="text-sm font-medium text-white">
                {title}
            </span>

            {#if description}
                <span class="text-xs text-muted-foreground">
                    {description}
                </span>
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
</div>
