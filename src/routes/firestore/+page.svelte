<script lang="ts">
	import CodeSnippet from "../../www-components/CodeSnippet/CodeSnippet.svelte";
	import Nav from "../../www-components/Nav/Nav.svelte";
	import NavItem from "../../www-components/Nav/NavItem.svelte";
	import CollectionStateDoc from "./CollectionStateDoc/CollectionStateDoc.svelte";
	import DocumentStateDoc from "./DocumentStateDoc/DocumentStateDoc.svelte";

	let sectionDisplayed: 1 | 2 = $state(1);
</script>

<!-- <h2>CollectionState</h2> -->

<div class="container">
	<Nav>
		<NavItem
			onclick={() => (sectionDisplayed = 1)}
			active={sectionDisplayed === 1}
		>
			CollectionState
		</NavItem>
		<NavItem
			onclick={() => (sectionDisplayed = 2)}
			active={sectionDisplayed === 2}
		>
			DocumentState
		</NavItem>
	</Nav>

	<div class="content">
		{#if sectionDisplayed === 1}
			<CollectionStateDoc />
		{:else}
			<DocumentStateDoc />
		{/if}
	</div>
</div>

<!-- <CodeSnippet -->
<!-- 	language="typescript" -->
<!-- 	code={`import { CollectionState } from 'svelte-firebase-state'; -->
<!-- import { firestore, auth } from "../firebase"; // Your firebase config file -->
<!---->
<!-- // In your svelte component or a .svelte.ts file -->
<!-- const collectionState = new CollectionState({ -->
<!--   auth, -->
<!--   firestore, -->
<!--   path: (user) => \`/users/\${user?.uid}/tasks\`, -->
<!-- }); -->
<!---->
<!-- // Reactive data = [task1, task2, ...] -->
<!-- $inspect(collectionState.data);`} -->
<!-- /> -->

<!-- <p> -->
<!-- 	DocumentState: Handles a single Firestore document, supporting fetching, live -->
<!-- 	updates, and saving changes to Firebase. -->
<!-- </p> -->
<!-- <CodeSnippet -->
<!-- 	language="typescript" -->
<!-- 	code={`import { CollectionState } from 'svelte-firebase-state'; -->
<!-- import { firestore, auth } from "../firebase"; // Your firebase config file -->
<!---->
<!-- // In your svelte component or a .svelte.ts file -->
<!-- const collectionState = new CollectionState({ -->
<!--   auth, -->
<!--   firestore, -->
<!--   path: (user) => \`/users/\${user?.uid}/tasks\`, -->
<!-- }); -->
<!---->
<!-- // Reactive data = [task1, task2, ...] -->
<!-- $inspect(collectionState.data);`} -->
<!-- /> -->

<style>
	.container {
		display: flex;
		flex-direction: column;
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 30px;
		padding: 40px 0;
	}
</style>
