<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
		href?: string;
		active?: boolean;
		onclick?: () => void;
	}

	let { children, href, active = false, onclick }: Props = $props();
</script>

{#if href}
	<a {href} class="nav-item" class:active>
		{@render children()}
	</a>
{:else}
	<button class="nav-item" class:active {onclick}>
		{@render children()}
	</button>
{/if}

<style>
	.nav-item {
		color: var(--black);
		text-decoration: none;
		font-size: 20px;
		padding: 8px 6px;
		opacity: 0.8;
		text-align: center;
		cursor: pointer;
	}
	.nav-item.active {
		opacity: 1;
		font-weight: 600;
		border-bottom: 2px solid var(--red-1);
		color: var(--red-1);
	}
</style>
