<script lang="ts">
    let subject = "";
    let body = "";
    let bannerFile: File | null = null;
    let bannerPreview: string | null = null;

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
        const formData = new FormData();
        formData.append("subject", subject);
        formData.append("body", body);
        if (bannerFile) formData.append("banner", bannerFile);

        const res = await fetch("/mailing/send", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) return alert("Failed to send mailing");

        alert("Mail sent!");
        subject = "";
        body = "";
        bannerFile = null;
        bannerPreview = null;
    }
</script>

<title>Vocal - Send Mail</title>

<div class="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-6 text-white">
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
                        style="width:100%; height:100px; object-fit:cover; display:block; border-radius:8px;"
                    />
                    <button
                        type="button"
                        class="absolute top-2 right-2 bg-black/50 px-2 rounded text-white"
                        on:click={removeBanner}>×</button
                    >
                </div>
            {/if}
        </div>

        <button
            type="submit"
            class="bg-vocal_lightest text-black px-6 py-2 rounded-lg font-medium mt-2"
        >
            Send to all subscribers
        </button>
    </form>

    <div class="flex-1">
        <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            style="background-color:#0b0b0b; font-family:Inter, Arial, sans-serif; color:#ffffff; margin:0; padding:0;"
        >
            <tbody>
                <tr>
                    <td align="center" style="padding:32px 16px;">
                        <table
                            width="100%"
                            style="max-width:600px; background:#121212; border-radius:12px; overflow:hidden;"
                        >
                            <tbody>
                                {#if bannerPreview}
                                    <tr>
                                        <td align="center" style="padding:0;">
                                            <img
                                                src={bannerPreview}
                                                alt="banner"
                                                style="width:100%; height:100px; object-fit:cover; display:block;"
                                            />
                                        </td>
                                    </tr>
                                {/if}

                                <tr>
                                    <td style="padding:24px 28px;">
                                        <p
                                            style="margin:0; line-height:1.7; color:#d1d1d1; white-space:pre-wrap;"
                                        >
                                            {body ||
                                                "Your email body will appear here…"}
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td
                                        style="padding:16px 28px; border-top:1px solid #1f1f1f; font-size:13px; color:#777;"
                                    >
                                        <p style="margin:0;">
                                            — The Vocal Team<br />
                                            <a
                                                href="https://vocal.wtf"
                                                style="color:#777; text-decoration:none;"
                                                >vocal.wtf</a
                                            > · support@vocal.wtf
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
