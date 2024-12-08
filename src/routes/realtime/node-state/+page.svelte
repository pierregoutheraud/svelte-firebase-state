<script lang="ts">
  import CodeSnippet from "../../../www-components/CodeSnippet/CodeSnippet.svelte";
  import Example from "../../../www-components/Example/Example.svelte";
  import NodeStateDemo1 from "./NodeStateDemo1.svelte";
  import NodeStateDemo1Code from "./NodeStateDemo1.svelte?raw";
  import NodeStateDemo2 from "./NodeStateDemo2.svelte";
  import NodeStateDemo2Code from "./NodeStateDemo2.svelte?raw";
</script>

<p>
  <span>NodeState</span> -> Manages a specific node in the Realtime Database, support
  fetching, live updates and saving changes with optional autosave.
</p>

<CodeSnippet
  language="typescript"
  code={`const users = new NodeState<User>({
  database,
  path: "users"
});`}
/>
<CodeSnippet
  language="typescript"
  code={`// NodeState Options

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

<Example text="Example: Listen to a node and save it" code={NodeStateDemo1Code}>
  <NodeStateDemo1 />
</Example>

<Example
  text="Example: Listen to a node and use autosave"
  code={NodeStateDemo2Code}
>
  <NodeStateDemo2 />
</Example>
