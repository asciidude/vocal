<script lang="ts">
    import { LogIn, TriangleAlert } from "lucide-svelte";
    import * as Alert from "$lib/components/ui/alert";
    import { Button } from "$lib/components/ui/button";
</script>

<title>Vocal - Login</title>

<main class="background">
    <div class="h-screen flex flex-col items-center justify-center text-center text-white w-96 mx-auto">
        <img src="images/vocal-icon-circle.png" alt="Vocal Icon" class="w-40">
        <p class="mt-5 text-xl italic">Welcome to <span class="text-vocal_light font-bold">Vocal</span></p>
        
        <Button class="bg-black/55 hover:bg-gray-800/55 w-40 mt-5" href='/api/auth/discord'>
            <span>Login with Discord</span>
            <span><LogIn class="ml-2 inline-block size-5" color="#fff" /></span>
        </Button>
         
        <Alert.Root class="mt-5 bg-black/55 border-none text-white max-[392px]:w-40">
            <TriangleAlert class="h-4 w-4" color="#fff" />
            <Alert.Title>Account approval required</Alert.Title>
            <Alert.Description class="italic">
                As Vocal is still in beta, your account must be approved by a superadmin. Ask through Discord!
            </Alert.Description>
        </Alert.Root>

        <p class="mt-5 italic underline text-vocal"><a href="https://discord.gg/4Rwr2pu2bW">Join our Discord</a></p>

        <!-- TODO: Add footer with privacy policy and terms of service -->
    </div>
</main>

<style>
    .background {
        background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/login-background.gif');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }
</style>