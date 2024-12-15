<script lang="ts">
  import Example from "@/www-components/Example/Example.svelte";
  import Param from "@/www-components/Param/Param.svelte";
  import NodeListStateDemo1 from "./NodeListStateDemo1.svelte";
  import NodeListStateDemo1Code from "./NodeListStateDemo1.svelte?raw";
  import NodeListStateDemo2 from "./NodeListStateDemo2.svelte";
  import NodeListStateDemo2Code from "./NodeListStateDemo2.svelte?raw";
</script>

<p>
  <span>NodeListState</span> manages a specific node in the Realtime Database, supporting
  fetching, live updates, and saving changes with optional autosave.
</p>

<h2>Quick example:</h2>

<Example code={NodeListStateDemo1Code} demoPosition="bottom">
  <NodeListStateDemo1 />
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
  type="Data[] | null | undefined"
  description={`Reactive state that holds the list, the node data.
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
  name="refetch"
  type="() => Promise<Data>"
  description="Re-fetch the data."
  backgroundColor="var(--light-pastel-blue-2)"
  borderColor="var(--light-pastel-blue-1)"
/>

<Param
  name="add"
  type="(data: Data) => Promise<DatabaseReference>"
  description="Add a new node to the list."
  backgroundColor="var(--light-pastel-blue-2)"
  borderColor="var(--light-pastel-blue-1)"
/>

<h2>More examples:</h2>

<Example
  text="Listen to a list (array) for a chat"
  code={NodeListStateDemo2Code}
>
  <NodeListStateDemo2 />
</Example>
