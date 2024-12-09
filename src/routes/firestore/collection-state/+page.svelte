<script lang="ts">
  import CodeSnippet from "../../../www-components/CodeSnippet/CodeSnippet.svelte";
  import Example from "../../../www-components/Example/Example.svelte";
  import Param from "../../../www-components/Param/Param.svelte";
  import CollectionStateDemo1 from "./CollectionStateDemo1.svelte";
  import CollectionStateDemo1Code from "./CollectionStateDemo1.svelte?raw";
  import CollectionStateDemo2 from "./CollectionStateDemo2.svelte";
  import CollectionStateDemo2Code from "./CollectionStateDemo2.svelte?raw";
</script>

<div class="title">
  <p>
    <span>CollectionState</span> -> Manages a Firestore collection.<br />Fetches
    data, listens for real-time updates, and provides utilities for adding,
    updating, and deleting documents.
  </p>
</div>

<h2>Quick example:</h2>

<Example code={CollectionStateDemo1Code}>
  <CollectionStateDemo1 />
</Example>

<h2>Parameters:</h2>

<Param
  name="firestore"
  type="Firestore"
  description="The firebase firestore instance."
  isRequired
/>

<Param
  name="path"
  type="string | ((currentUser: User | null) => string)"
  description="Listen for real-time updates."
  isRequired
/>

<Param
  name="auth"
  type="Auth"
  description="The firebase auth instance."
  code={`import { auth } from "./firebase.js"; // Your firebase auth instance

const tasks = new CollectionState<DbTasks, AppTasks>({
  auth, // <-
  firestore,

  // -> Use the current user in the path
  path: currentUser => \`users/\${currentUser?.uid}/tasks\`, 
});`}
/>

<Param
  name="listen"
  type="boolean"
  default="false"
  description="Listen for real-time updates."
/>

<Param
  name="query"
  type="(currentUser: User | null) => QueryConstraint[];"
  description="The query constraints"
/>

<h2>More examples:</h2>

<Example text="Example: Listen to a collection" code={CollectionStateDemo2Code}>
  <CollectionStateDemo2 />
</Example>

<style>
  .title {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
