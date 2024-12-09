<script lang="ts">
  import CodeSnippet from "../../../www-components/CodeSnippet/CodeSnippet.svelte";
  import Example from "../../../www-components/Example/Example.svelte";
  import Param from "../../../www-components/Param/Param.svelte";
  import NodeStateDemo1 from "./NodeStateDemo1.svelte";
  import NodeStateDemo1Code from "./NodeStateDemo1.svelte?raw";
  import NodeStateDemo2 from "./NodeStateDemo2.svelte";
  import NodeStateDemo2Code from "./NodeStateDemo2.svelte?raw";
  import NodeStateDemo3 from "./NodeStateDemo3.svelte";
  import NodeStateDemo3Code from "./NodeStateDemo3.svelte?raw";
</script>

<p>
  <span>NodeState</span> -> Manages a specific node in the Realtime Database, support
  fetching, live updates and saving changes with optional autosave.
</p>

<h2>Quick example:</h2>

<Example code={NodeStateDemo3Code}>
  <NodeStateDemo3 />
</Example>

<h2>Parameters:</h2>

<Param
  name="database"
  type="Database"
  description="The firebase database instance."
  isRequired
/>

<Param
  name="path"
  type="string | ((currentUser: User | null) => string)"
  description="The path to the node in the database."
  isRequired
/>

<Param
  name="auth"
  type="Auth"
  description="The firebase auth instance."
  code={`import { auth } from "./firebase.js"; // Your firebase auth instance

const user = new NodeListState<DbUser>({
  database,
  auth, // <-
  path: currentUser => \`users/\${currentUser?.uid}\`, // -> Use firebase current user
});`}
/>

<Param
  name="listen"
  type="boolean"
  description="Listen for real-time updates."
  default="false"
/>

<h2>More examples:</h2>

<Example text="Listen to a node and save it" code={NodeStateDemo1Code}>
  <NodeStateDemo1 />
</Example>

<Example text="Listen to a node and use autosave" code={NodeStateDemo2Code}>
  <NodeStateDemo2 />
</Example>
