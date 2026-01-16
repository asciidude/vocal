<title>Welcome to Vocal</title>

<meta property="og:type" content="website">
<meta property="og:title" content="Welcome to Vocal">
<meta property="og:description" content="Vocal — Coming March 2026. Join our Discord or mailing list to get notified when we release.">
<meta property="og:image" content="/images/vocal-banner.png">
<meta property="og:image:alt" content="Vocal — Coming March 2026">
<meta property="og:url" content="https://vocal.wtf">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Welcome to Vocal">
<meta name="twitter:description" content="Vocal — Coming March 2026. Join our Discord or mailing list to get notified when we release.">
<meta name="twitter:image" content="/images/vocal-banner.png">
<meta name="twitter:image:alt" content="Vocal — Coming March 2026">

<script lang="ts">
    let isSending = false;
    let email = "";
    
    async function handleSubmit(e: Event) {
        e.preventDefault();
        
        if (!email || isSending) return;
        
        isSending = true;
        
        try {
            const formData = new FormData();
            formData.append("email", email);
            
            const response = await fetch("/api/mailing/subscribe", {
                method: "POST",
                body: formData
            });
            
            if (response.ok) {
                email = "";
            }
        } catch (error) {
            console.error("Failed to submit:", error);
        } finally {
            isSending = false;
        }
    }
</script>

<div class="relative min-h-screen w-screen overflow-hidden">
    <div
        class="absolute inset-0 bg-center bg-cover"
        style="background-image: url('/images/launch-landing-bg.webp');"
    ></div>
    <div class="absolute inset-0 bg-black/70"></div>

    <div class="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div class="max-w-xl text-center text-white animate-fade-in">
            <p class="text-3xl font-medium mb-2">Coming March 2026</p>
            <p class="text-white/75 mb-5 text-xl">
                Join our Discord or mailing list to get notified when we release.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center text-xl">
                <a
                    href="https://discord.gg/YOURCODE"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center justify-center
                           rounded-full bg-vocal_strong
                           px-8 py-4 font-semibold
                           transition
                           hover:scale-105 hover:brightness-110
                           active:scale-95"
                >
                    Join our Discord
                </a>

                <form
                    on:submit|preventDefault={handleSubmit}
                    class="flex rounded-full overflow-hidden bg-white/10 backdrop-blur border border-white/20"
                >
                    <input
                        type="email"
                        required
                        placeholder="janedoe@gmail.com"
                        class="bg-transparent px-5 py-4 text-white placeholder-white/50 focus:outline-none w-64"
                        disabled={isSending}
                        bind:value={email}
                    />
                    <button
                        type="submit"
                        class="px-6 py-4 font-semibold bg-white text-black transition hover:bg-white/90 flex items-center justify-center gap-2"
                        disabled={isSending}
                    >
                        {#if isSending}
                            <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span class="ml-2">Sending...</span>
                        {:else}
                            Join list
                        {/if}
                    </button>
                </form>
            </div>

            <p class="mt-5 text-sm text-white/75">
                Are you a beta tester? <a href="/api/auth/discord" class="text-vocal_lightest">Login here</a>
            </p>
        </div>
    </div>
</div>

<style>
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }

    .animate-spin { animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>