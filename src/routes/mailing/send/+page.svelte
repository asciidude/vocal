<script lang="ts">
    import { toast } from "svelte-sonner";

    let subject = "";
    let body = "";
    let bannerFile: File | null = null;
    let bannerPreview: string | null = null;
    let sending = false;

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

        const formData = new FormData();
        formData.append("subject", subject);
        formData.append("body", body);
        if (bannerFile) formData.append("banner", bannerFile);

        try {
            const res = await fetch("/mailing/send", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (!data.success) {
                toast.error(data.error || "An unknown error occurred");
                console.error("Failed batches:", data.batches);
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
            toast.error("Failed to send mailing (network error)");
        } finally {
            sending = false;
        }
    }
</script>

<form on:submit={handleSubmit} class="flex flex-col gap-4">
    <input type="text" placeholder="Subject" bind:value={subject} required />
    <textarea placeholder="Body" bind:value={body} required rows={10}
    ></textarea>

    <input type="file" accept="image/*" on:change={handleBannerChange} />
    {#if bannerPreview}
        <div class="relative mt-2">
            <img
                src={bannerPreview}
                class="w-full h-24 object-cover"
                alt="banner"
            />
            <button
                type="button"
                on:click={removeBanner}
                class="absolute top-2 right-2">×</button
            >
        </div>
    {/if}

    <button type="submit" disabled={sending}>
        {sending ? "Sending..." : "Send to all subscribers"}
    </button>
</form>
