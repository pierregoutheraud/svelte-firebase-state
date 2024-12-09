<script lang="ts">
  import CodeSnippet from "@/www-components/CodeSnippet/CodeSnippet.svelte";
</script>

<div class="content">
  <p>
    <span>svelte-firebase-state</span> simplifies Firebase integration in Svelte/Sveltekit
    applications by providing easy-to-use reactive state classes for managing Firestore
    and Realtime Database data. These classes handle data fetching, live updates,
    user-specific queries and state management, allowing you to focus on your app's
    logic instead of Firebase boilerplate.
  </p>

  <h2>Usage</h2>

  <div class="paragraph">
    <p>1. Install the library with your favorite package manager.</p>
    <CodeSnippet language="html" code={`npm install svelte-firebase-state`} />
  </div>

  <div class="paragraph">
    <p>
      2. In your svelte component, import and create an instance of <span
        >CollectionState</span
      >,
      <span>DocumentState</span>, <span>NodeState</span>, or
      <span>NodeListState</span>, passing configuration options like Firestore,
      Authentication, query functions, or database paths.
      <br />
      <br />
      You can also instantiate the state class in a .svelte.ts file making it global
      to your app, in this case the data will be fetched only when the data is subscribed
      to (shown in a component ui or used in a reactive environment like $effect).
    </p>

    <CodeSnippet
      language="typescript"
      code={`import { CollectionState } from 'svelte-firebase-state';
import { firestore, auth } from "../firebase"; // Your firebase config file

const tasks = new CollectionState({
  auth,
  firestore,
  path: (user) => \`/users/\${user?.uid}/tasks\`,
  listen: true,
});`}
    />
  </div>

  <div class="paragraph">
    <p>
      3. Access <span>svelte 5</span> reactive state with the
      <span>"data"</span>
      property of the instance.
      <br />
      If you use the "listen" param, when your database receive updates your UI will
      be re-rendered with the correct data.
    </p>
    <CodeSnippet
      language="typescript"
      code={`// Reactive data = [task1, task2, ...]
$inspect(tasks.data);`}
    />
    <CodeSnippet
      language="svelte"
      code={`{#each tasks.data as task (task.id)}
  <p>{task.name}</p>
{/each}`}
    />
  </div>

  <div class="paragraph">
    <p>4. Perform CRUD Operations using class methods.</p>
    <CodeSnippet
      language="svelte"
      code={`<script>
  function handleAdd(newTask) {
    tasks.add(newTask);
  }

  function handleDelete(taskId) {
    tasks.delete(taskId);
  }
</script>`}
    />
  </div>
</div>

<style>
  .content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
  }

  .paragraph {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 30px;
  }
</style>
