<script lang="ts">
	import CodeSnippet from "../../../www-components/CodeSnippet/CodeSnippet.svelte";
	import Example from "../../../www-components/Example/Example.svelte";
	import NodeListStateDemo1 from "./NodeListStateDemo1.svelte";
	import NodeListStateDemo1Code from "./NodeListStateDemo1.svelte?raw";
</script>

<p>
	<span>NodeListState</span> -> Manages a specific node in the Realtime Database,
	supporting fetching, live updates, and saving changes with optional autosave.
</p>

<CodeSnippet
	language="typescript"
	code={`const users = new NodeListState<User>({
  database,
  path: "users"
});`}
/>
<CodeSnippet
	language="typescript"
	code={`// NodeListState Options

// The firebase auth instance (optional)
// In case you want to use the current user in the path
auth?: Auth;

// The firebase database instance
database: Database;

// The path to the collection
path: string | ((currentUser: User | null) => string);

// Listen for real-time updates (optional - default: false)
listen?: boolean;`}
/>

<Example
	text="Example: Listen to a list (array) for a chat"
	code={NodeListStateDemo1Code}
>
	<NodeListStateDemo1 />
</Example>
