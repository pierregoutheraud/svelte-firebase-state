<script lang="ts">
  import Example from "@/www-components/Example/Example.svelte";
  import Param from "@/www-components/Param/Param.svelte";
  import CollectionStateDemo1 from "./CollectionStateDemo1.svelte";
  import CollectionStateDemo1Code from "./CollectionStateDemo1.svelte?raw";
  import CollectionStateDemo2 from "./CollectionStateDemo2.svelte";
  import CollectionStateDemo2Code from "./CollectionStateDemo2.svelte?raw";
</script>

<div class="title">
  <p>
    <span>CollectionState</span> manages a Firestore collection.<br />Fetches
    data, listens for real-time updates, and provides utilities for adding,
    updating, and deleting documents.
  </p>
</div>

<h2>Quick example:</h2>

<Example code={CollectionStateDemo1Code} demoPosition="bottom">
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
  isOptional
/>

<Param
  name="listen"
  type="boolean"
  default="false"
  description="Listen for real-time updates."
  isOptional
/>

<Param
  name="query"
  type="(currentUser: User | null) => QueryConstraint[];"
  description="The query constraints"
  isOptional
/>

<Param
  name="fromFirestore"
  type="(snapshot) => DataApp"
  description="Function that converts the Firestore data to the app data"
  default={`snap => ({ ...snap.data(), id: snap.id })`}
  isOptional
  code={`// fromFirestore example

type DbUser = {
  name: string;
  age: number;
};

type AppUser = DbUser & { 
  id: string, 
  firstname: string, 
  lastname: string 
};

const users = new CollectionState<DbUser, AppUser>({
  firestore,
  path: "your/firestore/collection/path",
  fromFirestore: (doc) => {
    const data = doc.data();
    const [firstname, lastname] = data.name.split(" ");
    return {
      ...data,
      firstname,
      lastname,
      id: doc.id
    };
  },  
});

$inspect(user.data);
/*
{ 
  id: "123", 
  age: 25, 
  name: "Anna Smith", 
  firstname: "Anna", 
  lastname: "Smith" 
}
*/`}
/>

<Param
  name="toFirestore"
  type="(data: DataApp) => DataDb"
  description="Function that converts the app data to the firestore data"
  default="data => data"
  isOptional
  code={`type DbUser = {
  name: string;
  age: number;
};

type AppUser = DbUser & { 
  id: string 
};

const users = new CollectionState<DbUser, AppUser>({
  firestore,
  path: "your/firestore/collection/path",
  fromFirestore: doc => ({ id: doc.id, ...doc.data() }),
  toFirestore: data => {
    const { id, ...d } = data;
    return d;
  },  
});`}
/>

<h2>Methods:</h2>

<Param
  name="add"
  type="(data: AppData) => Promise<string | void>"
  description="Add a document to the collection. Returns the id of the new document."
  backgroundColor="var(--light-pastel-blue-2)"
  borderColor="var(--light-pastel-blue-1)"
  code={`const id = await tasks.add({ title: "New task", completed: false });`}
/>

<Param
  name="delete"
  type="(docId: string): Promise<void>"
  description="Remove a document from the collection."
  backgroundColor="var(--light-pastel-blue-2)"
  borderColor="var(--light-pastel-blue-1)"
  code={`await tasks.delete("123");`}
/>

<Param
  name="refetch"
  type="(): Promise<void>"
  description="Refetch the collection data."
  backgroundColor="var(--light-pastel-blue-2)"
  borderColor="var(--light-pastel-blue-1)"
  code={`await tasks.refetch();`}
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
