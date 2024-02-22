<script lang="ts">
	import { signIn } from "@auth/sveltekit/client";
	import LogoBig from "./Logo_2.svelte";
</script>

<div class="flex h-screen w-screen flex-col items-center justify-center gap-10">
	<div class="flex h-fit w-fit flex-col items-center gap-5">
      <div class="cognitivelab text-2xl text-blue-600">Solvathon</div>
	</div>

	<button
		class="login flex flex-row items-center justify-center rounded-full border-2 border-blue-900 bg-gradient-to-r from-cyan-500 to-blue-800"
		on:click={() => signIn("google")}
	>
		Login with Google
	</button>
</div>

<style>
	.login {
		height: min(10vh, 70px);
		width: min(90vw, 400px);
	}

	.cognitivelab {
		background: -webkit-linear-gradient(rgb(113, 207, 244), #1e40af);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>
