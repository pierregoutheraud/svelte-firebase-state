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
  code={`const users = new CollectionState<User>({
  auth,
  firestore,
	listen: true,
	path: "your/firestore/collection/path",
});`}
/>
<CodeSnippet
  language="typescript"
  code={`// CollectionState Options

// The firebase auth instance (optional)
// In case you want to use the current user in the path
auth?: Auth;

// The firebase firestore instance
firestore: Firestore;

// The path to the collection
path: string | ((currentUser: User | null) => string);

// The query constraints (optional)
query?: (currentUser: User | null) => QueryConstraint[];

// Listen for real-time updates (optional - default: false)
listen?: boolean;`}
/>

<Example text="Example: Listen to a collection" code={CollectionStateDemo1Code}>
  <CollectionStateDemo1 />
</Example>
