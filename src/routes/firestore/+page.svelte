<script lang="ts">
	import CodeSnippet from "../../www-components/CodeSnippet/CodeSnippet.svelte";
	import CollectionStateDemo1 from "../../www-components/CollectionStateExample1/CollectionStateDemo1.svelte";
	import CollectionStateDemo1Code from "../../www-components/CollectionStateExample1/CollectionStateDemo1Code.js";
	import Example from "../../www-components/Example/Example.svelte";
	import Expandable from "../../www-components/Expandable/Expandable.svelte";
	import Nav from "../../www-components/Nav/Nav.svelte";
	import NavItem from "../../www-components/Nav/NavItem.svelte";

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
			<p>
				CollectionState -> Manages a Firestore collection. Fetches data, listens
				for real-time updates, and provides utilities for adding, updating, and
				deleting documents.
			</p>
			<Example
				text="Example: Listen to a collection"
				code={CollectionStateDemo1Code}
			>
				<CollectionStateDemo1 />
			</Example>
		{:else}
			<p>
				DocumentState -> Handles a single Firestore document, supporting
				fetching, live updates, and saving changes to Firebase.
			</p>
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
		padding: 40px 0;
	}

	.content > p:first-child {
		margin-bottom: 20px;
	}
</style>
