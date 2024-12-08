# svelte-firebase-state

svelte-firebase-state simplifies Firebase integration in Svelte/Sveltekit applications by providing easy-to-use reactive state classes for managing Firestore and Realtime Database data. These classes handle data fetching, live updates, user-specific queries and state management, allowing you to focus on your app's logic instead of Firebase boilerplate.

## Usage

1. Install the library with your favorite package manager.

```bash
npm install svelte-firebase-state
```

2. In your svelte component, import and create an instance of `CollectionState`, `DocumentState`, `NodeState`, or `NodeListState`, passing configuration options like Firestore, Authentication, query functions, or database paths.

You can also instantiate the state class in a .svelte.ts file making it global to your app, in this case the data will be fetch only when the data is subscribed to (shown in a component or logged in a reactive environment).

```typescript
import { CollectionState } from "svelte-firebase-state";
import { firestore, auth } from "../firebase"; // Your firebase config file
const tasks = new CollectionState({
	auth,
	firestore,
	path: (user) => `/users/${user?.uid}/tasks`,
	listen: true
});
```

3. Access **svelte 5** reactive state with the "data" property of the instance.

If you use the "listen" param, when your database receive updates your UI will be re-rendered with the correct data.

```typescript
// Reactive data = [task1, task2, ...]
$inspect(tasks.data);
```

```svelte
{#each tasks.data as task (task.id)}
	<p>{task.name}</p>
{/each}
```

4. Perform CRUD Operations using class methods.

```svelte
<script>
	function handleAdd(newTask) {
		tasks.add(newTask);
	}
	function handleDelete(taskId) {
		tasks.delete(taskId);
	}
</script>
```
