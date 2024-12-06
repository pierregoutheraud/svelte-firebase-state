<script lang="ts">
	import CodeSnippet from "../../../www-components/CodeSnippet/CodeSnippet.svelte";
	import Example from "../../../www-components/Example/Example.svelte";
	import CollectionStateDemo1 from "./CollectionStateDemo1.svelte";
	import CollectionStateDemo1Code from "./CollectionStateDemo1.svelte?raw";
</script>

<p>
	<span>CollectionState</span> -> Manages a Firestore collection.<br />Fetches
	data, listens for real-time updates, and provides utilities for adding,
	updating, and deleting documents.
</p>

<CodeSnippet
	language="typescript"
	code={`type CollectionStateOptions = {
  firestore: Firestore;
  path: string | ((user: User | null) => string);
  auth?: Auth;
  query?: (user: User | null) => QueryConstraint[];
  listen?: boolean;
};`}
/>

<Example text="Example: Listen to a collection" code={CollectionStateDemo1Code}>
	<CollectionStateDemo1 />
</Example>
