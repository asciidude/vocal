<script lang="ts">
    import TriangleAlert from "lucide-svelte/icons/triangle-alert";
    import * as Alert from "$lib/components/ui/alert";
    import { Button } from "$lib/components/ui/button";
</script>

<title>Vocal - Login</title>

<main class="background">
    <div class="h-screen flex flex-col items-center justify-center text-center text-white w-96 mx-auto">
        <img src="images/vocal-icon-circle.png" alt="Vocal Icon" class="w-40">
        <p class="mt-5 text-xl italic">Welcome to <span class="text-vocal font-bold">Vocal</span></p>
        
        <Button class="bg-black hover:bg-gray-800 w-40 mt-5" href="/login">Login with Discord</Button>

        <Alert.Root class="mt-5 bg-black border-none text-white max-[392px]:w-40">
            <TriangleAlert class="h-4 w-4" color="#fff" />
            <Alert.Title>You are required to have the beta tester role.</Alert.Title>
            <Alert.Description class="italic">
                Don't have one? Ask a friend who does and see if they have any spare keys!
            </Alert.Description>
        </Alert.Root>
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