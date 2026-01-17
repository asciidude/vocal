<script lang="ts">
    import { Mail } from "lucide-svelte";
</script>

<title>Vocal - Manage your mail</title>

<div
    class="h-screen w-screen flex flex-col items-center justify-center bg-vocal_dark_bg"
>
    <h1 class="text-2xl font-semibold text-white mb-6">Manage your mail</h1>

    <div
        class="w-full max-w-sm p-6 bg-[#1B1626] rounded-lg shadow-md text-white border border-vocal_lightest"
    >
        <form method="POST" action="/api/mailing/subscribe" class="mb-4">
            <div
                class="flex items-center rounded-md overflow-hidden mb-4 border-vocal_strong border-2"
            >
                <span class="p-2 text-white bg-vocal_darkest">
                    <Mail class="w-6 h-6" />
                </span>
                <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    class="flex-1 px-3 py-2 bg-vocal_darkest outline-none text-white"
                    required
                />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <button
                    type="submit"
                    class="py-2 px-4 rounded-md shadow hover:shadow-md transition bg-vocal_darkest outline outline-1 outline-vocal_lightest"
                >
                    Subscribe
                </button>
                <button
                    type="submit"
                    formaction="/api/mailing/unsubscribe"
                    class="py-2 px-4 rounded-md shadow hover:shadow-md transition bg-vocal_darkest outline outline-1 outline-vocal_lightest"
                >
                    Unsubscribe
                </button>
            </div>
        </form>
    </div>
</div>
