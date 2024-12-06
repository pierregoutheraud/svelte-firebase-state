<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
	let expanded = $state(false);
</script>

<div class="expandable">
	<h4>{@render children()}</h4>

	<button onclick={() => (expanded = !expanded)}> + </button>
</div>

<style>
	.expandable {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--black);
		padding: 20px 30px;
	}

	.expandable:last-child {
		border-bottom: none;
	}

	.expandable h4 {
		font-size: 24px;
	}

	.expandable > button {
		font-size: 30px;
		font-weight: 700;
		position: relative;
		top: -3px;
	}
</style>
