<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { toast } from 'svelte-sonner';

    export let userId: string;
    export let environment: 'sandbox' | 'production' = 'sandbox';
    export let onComplete: () => void = () => {};
    export let onCancel: () => void = () => {};

    let loading = false;
    let error: string | null = null;

    const loadPersonaScript = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (window.Persona) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.withpersona.com/dist/persona-v4.6.0.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Persona script'));
            document.head.appendChild(script);
        });
    };

    const initializePersona = async () => {
        if (!window.Persona) {
            throw new Error('Persona SDK not loaded');
        }

        return new Promise((resolve, reject) => {
            const client = new window.Persona.Client({
                templateId: 'itmpl_cMXTpkRaBKhLKNwnC2mvn9z7TZne',
                environment: environment,
                referenceId: userId,
                onLoad: () => {
                    console.log('Persona loaded');
                },
                onComplete: ({ inquiryId, status, fields }) => {
                    console.log('Persona completed:', { inquiryId, status, fields });
                    
                    if (status === 'completed' || status === 'approved') {
                        resolve({ inquiryId, status, fields });
                    } else {
                        reject(new Error(`Verification ${status}`));
                    }
                },
                onCancel: ({ inquiryId, sessionToken }) => {
                    console.log('Persona cancelled:', { inquiryId, sessionToken });
                    reject(new Error('Verification cancelled'));
                },
                onError: (error) => {
                    console.error('Persona error:', error);
                    reject(error);
                }
            });

            client.open();
        });
    };

    const handleVerificationComplete = async () => {
        try {
            const response = await fetch('/api/account/verify/persona/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || 'Failed to save verification');
            }
            
            return true;
        } catch (err) {
            console.error('Complete verification error:', err);
            return false;
        }
    };

    const startVerification = async () => {
        if (!userId) {
            error = 'Missing configuration';
            return;
        }

        loading = true;
        error = null;

        try {
            await loadPersonaScript();
            const result = await initializePersona();
            
            const success = await handleVerificationComplete();
            if (success) {
                onComplete();
                toast.success('Age verification completed successfully!');
            } else {
                throw new Error('Failed to save verification result');
            }
        } catch (err) {
            error = err instanceof Error ? err.message : 'Verification failed';
            
            if (error.includes('cancelled')) {
                toast.info('Age verification was cancelled');
            } else {
                toast.error(error);
            }
        } finally {
            loading = false;
        }
    };

    const handleRetry = async () => {
        await startVerification();
    };

    onMount(() => {
        startVerification();
    });

    onDestroy(() => {
        const script = document.querySelector('script[src*="withpersona.com"]');
        if (script) {
            script.remove();
        }
    });
</script>

<div class="w-full h-[500px] flex items-center justify-center">
    {#if loading}
        <div class="flex flex-col items-center space-y-4">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p class="text-white">Loading age verification...</p>
        </div>
    {:else if error}
        <div class="text-center space-y-4">
            <p class="text-red-500">{error}</p>
            <div class="flex space-x-4 justify-center">
                <button
                    on:click={handleRetry}
                    class="bg-vocal_lightest text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                >
                    Retry Verification
                </button>
                <button
                    on:click={() => onCancel()}
                    class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                >
                    Cancel
                </button>
            </div>
        </div>
    {/if}
</div>

<div id="persona-container" />