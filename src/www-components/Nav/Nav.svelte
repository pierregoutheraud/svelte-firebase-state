<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="nav">
	{@render children()}
</div>

<style>
	.nav {
		align-self: center;
		display: flex;
		gap: 20px;
	}
</style>
