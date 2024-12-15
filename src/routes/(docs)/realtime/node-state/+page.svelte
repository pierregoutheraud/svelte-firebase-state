<script lang="ts">
  import Example from "@/www-components/Example/Example.svelte";
  import Param from "@/www-components/Param/Param.svelte";
  import NodeStateDemo1 from "./NodeStateDemo1.svelte";
  import NodeStateDemo1Code from "./NodeStateDemo1.svelte?raw";
  import NodeStateDemo2 from "./NodeStateDemo2.svelte";
  import NodeStateDemo2Code from "./NodeStateDemo2.svelte?raw";
  import NodeStateDemo3 from "./NodeStateDemo3.svelte";
  import NodeStateDemo3Code from "./NodeStateDemo3.svelte?raw";
</script>

<p>
  <span>NodeState</span> manages a specific node in the Realtime Database, support
  fetching, live updates and saving changes with optional autosave.
</p>

<h2>Quick example:</h2>

<Example code={NodeStateDemo3Code} demoPosition="bottom">
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
  isOptional
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
  isOptional
/>

<h2>Properties:</h2>

<Param
  name="data"
  type="Data | null | undefined"
  description={`Reactive state that holds the node data.
The data is undefined when loading.
The data is null when the node could not be found.`}
  backgroundColor="var(--green-light-2)"
  borderColor="var(--green-light-1)"
  code={`{#each users.data as user (user.id)}
  <p>{user.name}</p>
{/each}`}
/>

<h2>Methods:</h2>

<Param
  name="save"
  type="(key?: K, update?: DataApp[K] | ((prevValue: DataApp[K]) => DataApp[K])) => Promise<void>"
  description="Save changes to the document."
  backgroundColor="var(--light-pastel-blue-2)"
  borderColor="var(--light-pastel-blue-1)"
  code={`await user.save("name", "Anna Smith");

// or

user.data.name = "Anna Smith";
await user.save();`}
/>

<Param
  name="refetch"
  type="() => Promise<Data>"
  description="Re-fetch the data."
  backgroundColor="var(--light-pastel-blue-2)"
  borderColor="var(--light-pastel-blue-1)"
/>

<h2>More examples:</h2>

<Example text="Listen to a node and save it" code={NodeStateDemo1Code}>
  <NodeStateDemo1 />
</Example>

<Example text="Listen to a node and use autosave" code={NodeStateDemo2Code}>
  <NodeStateDemo2 />
</Example>
