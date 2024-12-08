<script lang="ts">
	import "./global.css";
	import GithubIcon from "../components/GithubIcon.svelte";
	import { onMount, type Snippet } from "svelte";
	import { page } from "$app/stores";
	import Nav from "../www-components/Nav/Nav.svelte";
	import NavItem from "../www-components/Nav/NavItem.svelte";

	interface Props {
		children: Snippet;
	}
	let { children }: Props = $props();
	let stars = $state(0);

	const routes = [
		{ name: "What is it?", pathname: "/" },
		{ name: "Firestore", pathname: "/firestore" },
		{ name: "Realtime Database", pathname: "/realtime" }
	];

	async function fetchStars() {
		const res = await fetch(
			"https://api.github.com/repos/pierregoutheraud/svelte-firebase-state"
		);
		const data = await res.json();
		stars = data.stargazers_count;
	}

	onMount(() => {
		fetchStars();
	});
</script>

<main>
	<header>
		<div class="title">
			<h1>svelte-firebase-state</h1>
		</div>

		<h2>Svelte 5 utilities for Firebase.</h2>

		<div class="install">
			<div class="console">npm install svelte-firebase-state</div>
			<a
				href="https://github.com/pierregoutheraud/svelte-firebase-state"
				target="_blank"
				class="github"
				><GithubIcon /> Github
			</a>
			<div class="version">Version {PKG.version}</div>
		</div>
	</header>

	<section class="docs">
		<Nav>
			{#each routes as route}
				<NavItem
					href={route.pathname}
					active={$page.url.pathname === route.pathname}
				>
					{route.name}
				</NavItem>
			{/each}
		</Nav>

		{@render children()}
	</section>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
	}

	header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 40px;
		background-color: var(--gray);
		padding: 60px 0;
		width: 100%;
	}

	.title {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
	}
	header h2 {
		font-size: 30px;
		font-weight: 400;
	}

	.install {
		display: flex;
		align-items: center;
		gap: 30px;
	}

	.version {
		font-size: 14px;
		padding: 4px 9px 4px 8px;
		border: 1px solid rgba(0, 0, 0, 0.5);
		color: rgba(0, 0, 0, 0.5);
	}

	.source {
		display: flex;
		flex-direction: column;
		gap: 10px;
		align-items: center;
	}

	.github {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;
		font-size: 16px;
		color: black;
	}
	a.github span {
		color: red;
		text-decoration: none;
	}
	.github:hover {
		text-decoration: none;
	}
	.github :global(svg) {
		width: 24px;
	}

	.console {
		background: #24242e;
		color: white;
		padding: 20px 24px;
		font-weight: 600;
		word-spacing: 6px;
	}

	main h1 {
		text-align: center;
		margin: 0px;
		font-weight: 800;
		background-color: var(--red-1);
		color: white;
		display: inline-flex;
		padding: 16px 20px;
		align-self: center;
		font-size: 40px;
	}

	.docs {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 40px 0 500px;
		width: 1000px;
	}
</style>
