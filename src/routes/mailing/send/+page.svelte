<script lang="ts">
    import { toast } from "svelte-sonner";

    let subject = "";
    let body = "";
    let bannerFile: File | null = null;
    let bannerPreview: string | null = null;
    let sending = false;
    let errorMsg: string | null = null;
    let failedBatches: any[] = [];

    function handleBannerChange(e: Event) {
        const input = e.target as HTMLInputElement;
        if (input.files?.[0]) {
            bannerFile = input.files[0];
            const reader = new FileReader();
            reader.onload = () => (bannerPreview = reader.result as string);
            reader.readAsDataURL(bannerFile);
        }
    }

    function removeBanner() {
        bannerFile = null;
        bannerPreview = null;
    }

    async function handleSubmit(e: Event) {
        e.preventDefault();
        sending = true;
        failedBatches = [];

        const formData = new FormData();
        formData.append("subject", subject);
        formData.append("body", body);
        if (bannerFile) formData.append("banner", bannerFile);

        try {
            const res = await fetch("/api/mailing/send", {
                method: "POST",
                body: formData,
            });
            const data = await res.json().catch(() => null);

            if (!data?.success) {
                failedBatches = data?.batches || [];
                toast.error(data.message || "An error occured");
                console.error("Failed batches:", failedBatches);
            } else {
                toast.success(
                    `Emails have been sent successfully to all ${data.sent} subscribers!`,
                );
                subject = "";
                body = "";
                bannerFile = null;
                bannerPreview = null;
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to send mail to subscribers");
        } finally {
            sending = false;
        }
    }
</script>

<div class="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-6 text-white">
    <!-- Form -->
    <form on:submit={handleSubmit} class="flex-1 space-y-4">
        <input
            type="text"
            placeholder="Subject"
            bind:value={subject}
            class="w-full rounded-lg bg-[#130f1b] border border-[#2d2249] px-4 py-2 text-white"
            required
        />

        <textarea
            placeholder="Body"
            bind:value={body}
            class="w-full rounded-lg bg-[#130f1b] border border-[#2d2249] px-4 py-2 text-white"
            rows="10"
            required
        ></textarea>

        <div>
            <input
                type="file"
                accept="image/*"
                on:change={handleBannerChange}
            />
            {#if bannerPreview}
                <div class="relative mt-2 w-full cursor-pointer">
                    <img
                        src={bannerPreview}
                        alt="banner"
                        class="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                        type="button"
                        class="absolute top-2 right-2 bg-black/50 px-2 rounded text-white"
                        on:click={removeBanner}
                    >
                        ×
                    </button>
                </div>
            {/if}
        </div>

        <button
            type="submit"
            class="bg-vocal_lightest text-black px-6 py-2 rounded-lg font-medium mt-2"
            disabled={sending}
        >
            {sending ? "Sending..." : "Send to all subscribers"}
        </button>

        {#if errorMsg}
            <p class="text-red-500 mt-2">{errorMsg}</p>
            {#if failedBatches.length}
                <ul class="mt-1 text-red-400 list-disc list-inside">
                    {#each failedBatches as b, i}
                        <li>Batch {i + 1} failed ({b.failed || 0} emails)</li>
                    {/each}
                </ul>
            {/if}
        {/if}
    </form>

    <!-- Live Preview -->
    <div class="flex-1">
        <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            class="bg-[#0b0b0b] font-sans text-white m-0 p-0"
        >
            <tbody>
                <tr>
                    <td align="center" class="p-8">
                        <table
                            class="w-full max-w-lg bg-[#121212] rounded-lg overflow-hidden"
                        >
                            <tbody>
                                {#if bannerPreview}
                                    <tr>
                                        <td align="center" class="p-0">
                                            <img
                                                src={bannerPreview}
                                                alt="banner"
                                                class="w-full h-24 object-cover block"
                                            />
                                        </td>
                                    </tr>
                                {/if}
                                <tr>
                                    <td class="p-6">
                                        <p
                                            class="m-0 leading-7 text-[#d1d1d1] whitespace-pre-wrap"
                                        >
                                            {body ||
                                                "Your email body will appear here…"}
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        class="p-4 border-t border-[#1f1f1f] text-xs text-[#777]"
                                    >
                                        <p class="m-0">
                                            — The Vocal Team<br />
                                            <a
                                                href="https://vocal.wtf"
                                                class="text-[#777] no-underline"
                                            >
                                                vocal.wtf
                                            </a> · support@vocal.wtf
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
