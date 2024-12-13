<script>
  import CodeSnippet from "@/www-components/CodeSnippet/CodeSnippet.svelte";

  const code = `<script>
import { CollectionState } from 'svelte-firebase-state';
import { firestore, auth } from "./firebase.js";

const tasks = new CollectionState<Task>({
  auth,
  firestore,
  path: (user) => \`/users/\${user?.uid}/tasks\`,
  listen: true,
});
<\/script>

{#each tasks.data as task (task.id)}
  <p>{task.name}</p>
{/each}`;
</script>

<div class="image">
  <div class="title">
    <h1>svelte-firebase-state</h1>
    <h2>Firebase utilities for Svelte 5.</h2>
  </div>
  <CodeSnippet {code} />
</div>

<style>
  .image {
    width: 1200px;
    height: 630px;
    background: var(--red-1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
    color: white;
  }

  .title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    margin-top: -20px;
  }
  .image h1 {
    font-size: 40px;
    font-weight: 800;
  }
  .image h2 {
    font-size: 24px;
    font-weight: 300;
  }
</style>
