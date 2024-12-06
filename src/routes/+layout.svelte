<script lang="ts">
	import "./global.css";
	import GithubIcon from "../components/GithubIcon.svelte";
	// import CodeSnippet from "../www-components/CodeSnippet/CodeSnippet.svelte";
	import CollectionStateDemo1 from "../www-components/CollectionStateExample1/CollectionStateDemo1.svelte";
	import CollectionStateDemo1Code from "../www-components/CollectionStateExample1/CollectionStateDemo1Code.js";
	import Example from "../www-components/Example/Example.svelte";
	import Expandable from "../www-components/Expandable/Expandable.svelte";
	import type { Snippet } from "svelte";
	import { page } from "$app/stores";
	// import CollectionStateExample1 from "../www-components/CollectionStateExample1/CollectionStateExample1.svelte";
	// import CollectionStateExample2 from "../www-components/CollectionStateExample2/CollectionStateExample2.svelte";

	interface Props {
		children: Snippet;
	}
	let { children }: Props = $props();

	const routes = [
		{ name: "What is it?", pathname: "/" },
		{ name: "Firestore", pathname: "/firestore" },
		{ name: "Realtime", pathname: "/realtime" }
	];
</script>

<main>
	<header>
		<div class="title">
			<h1>svelte-firebase-state</h1>
		</div>

		<p>Svelte 5 utilities for Firebase.</p>

		<div class="install">
			<div class="console">npm install svelte-firebase-state</div>
			<a
				href="https://github.com/pierregoutheraud/svelte-firebase-state"
				target="_blank"
				class="source"
				><GithubIcon /> Source
			</a>
			<div class="version">Version {PKG.version}</div>
		</div>
	</header>

	<section class="docs">
		<div class="nav">
			{#each routes as route}
				<a
					href={route.pathname}
					class="nav-item"
					class:active={$page.url.pathname === route.pathname}
				>
					{route.name}
				</a>
			{/each}
		</div>

		{@render children()}

		<!-- <h2>Firestore</h2> -->

		<!-- <div class="doc"> -->
		<!-- 	<h3>CollectionsState class</h3> -->
		<!-- 	<Expandable>yolo</Expandable> -->
		<!-- <div class="examples"> -->
		<!-- 	<Example -->
		<!-- 		text="Example: Listen to a collection" -->
		<!-- 		code={CollectionStateDemo1Code} -->
		<!-- 	> -->
		<!-- 		<CollectionStateDemo1 /> -->
		<!-- 	</Example> -->
		<!-- </div> -->
		<!-- </div> -->
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
	header p {
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
		border: 1px solid rgba(0, 0, 0, 0.1);
		color: var(--black);
		padding: 4px 8px;
	}

	.source {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;
		color: black;
	}
	.source:hover {
		text-decoration: none;
	}
	.source :global(svg) {
		width: 30px;
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

	main h2 {
		font-size: 30px;
		background: var(--black);
		color: white;
		padding: 20px;
	}

	main h3 {
		font-size: 20px;
	}

	.docs {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 40px 0 500px;
		width: 1000px;
	}

	.doc {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.examples {
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	.nav {
		align-self: center;
		display: flex;
		gap: 20px;
	}
	.nav-item {
		color: var(--black);
		text-decoration: none;
		font-size: 20px;
		padding: 10px 8px;
		opacity: 0.8;
		text-align: center;
	}
	.nav-item.active {
		opacity: 1;
		font-weight: 600;
		border-bottom: 2px solid var(--red-1);
		color: var(--red-1);
	}
</style>
