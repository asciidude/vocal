<script lang="ts">
    import { Mail } from "lucide-svelte";
    import { toast } from "svelte-sonner";

    let email = '';

    async function submitSubscription(subscribe: boolean) {
        if(!email) return;

        try {
            const res = await fetch(`/api/mailing/${subscribe ? '' : 'un'}subscribe`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email
                }),
            });

            const data = await res.json();

            if (!res.ok || data.status !== 200) {
                toast.error(data.message || 'An error occured');
                return;
            }

            email = '';

            if(subscribe) {
                toast.success('You have been subscribed! Check your email to unsubscribe.');
            } else {
                toast.success('You have been successfully unsubscribed from our mailing list!');
            }
        } catch (err) {
            console.error(err);
        }
    }
</script>

<title>Vocal - Manage your mail</title>

<div
    class="h-screen w-screen flex flex-col items-center justify-center bg-vocal_dark_bg"
>
    <h1 class="text-2xl font-semibold text-white mb-6">Manage your mail</h1>

    <div
        class="w-full max-w-sm p-6 bg-[#1B1626] rounded-lg shadow-md text-white border border-vocal_lightest"
    >
        <form class="mb-4">
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
                    bind:value={email}
                />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <button
                    type="submit"
                    class="py-2 px-4 rounded-md shadow hover:shadow-md transition bg-vocal_darkest outline outline-1 outline-vocal_lightest"
                    onclick={() => submitSubscription(true)}
                >
                    Subscribe
                </button>
                <button
                    type="button"
                    class="py-2 px-4 rounded-md shadow hover:shadow-md transition bg-vocal_darkest outline outline-1 outline-vocal_lightest"
                    onclick={() => submitSubscription(false)}
                >
                    Unsubscribe
                </button>
            </div>
        </form>
    </div>
</div>
