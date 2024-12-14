<script lang="ts">
  import Example from "@/www-components/Example/Example.svelte";
  import Param from "@/www-components/Param/Param.svelte";
  import DocumentStateDemo1 from "./DocumentStateDemo1.svelte";
  import DocumentStateDemo1Code from "./DocumentStateDemo1.svelte?raw";
  import DocumentStateDemo2 from "./DocumentStateDemo2.svelte";
  import DocumentStateDemo2Code from "./DocumentStateDemo2.svelte?raw";
  import DocumentStateDemo3 from "./DocumentStateDemo3.svelte";
  import DocumentStateDemo3Code from "./DocumentStateDemo3.svelte?raw";
</script>

<div class="title">
  <p>
    <span>DocumentState</span> manages a single Firestore document.<br />Fetch
    data, listen for real-time updates and save changes to Firebase.
  </p>
</div>

<h2>Quick example:</h2>

<Example code={DocumentStateDemo1Code} demoPosition="bottom">
  <DocumentStateDemo1 />
</Example>

<h2>Parameters:</h2>

<Param
  name="firestore"
  type="Firestore"
  description="The firebase firestore instance."
  isRequired
/>

<Param
  name="auth"
  type="Auth"
  description="The firebase auth instance."
  isOptional
  code={`import { auth } from "./firebase.js"; // Your firebase auth instance

const user = new DocumentState<DbUser>({
  auth, // <-
  firestore,

  // -> Use the current user in the path
  path: currentUser => \`users/\${currentUser?.uid}\`, 
});`}
/>

<Param
  name="listen"
  type="boolean"
  description="Listen for real-time updates."
  default="false"
  isOptional
/>

<Param
  name="path"
  type="string"
  description="The path to the document."
  isOptional
/>

<Param
  name="collectionPath"
  type="string"
  description="The path to the collection. Should be used with the query param."
  isOptional
  code={`
const user = new DocumentState<DbUser>({
  firestore,
  // When you don't have the id of the document
  // you can use collectionPath & query to query the document you need.
  collectionPath: "users",
  query: (u) => {
    return [where("name", "==", "Anna")];
  }
});`}
/>

<Param
  name="query"
  type="(user: User | null) => QueryConstraint[]"
  description="Function that returns the query constraints. Should be used with the collectionPath param."
  isOptional
  code={`
const user = new DocumentState<DbUser>({
  firestore,
  // When you don't have the id of the document
  // you can use collectionPath & query to query the document you need.
  collectionPath: "users",
  query: (u) => {
    return [where("name", "==", "Anna")];
  }
});`}
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

const user = new DocumentState<DbUser, AppUser>({
  firestore,
  path: "your/firestore/document/path",
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

const user = new DocumentState<DbUser, AppUser>({
  firestore,
  path: "your/firestore/document/path",
  fromFirestore: doc => ({ id: doc.id, ...doc.data() }),
  toFirestore: data => {
    const { id, ...d } = data;
    return d;
  },  
});`}
/>

<h2>Properties:</h2>

<Param
  name="data"
  type="AppData | null | undefined"
  description={`Reactive state that holds the collection data.
The data is undefined when loading.
The data is null when the document could not be found.`}
  backgroundColor="var(--green-light-2)"
  borderColor="var(--green-light-1)"
  code={`$inspect(user.data);`}
/>

<Param
  name="loading"
  type="boolean"
  description="Reactive state indicating if the document data is loading."
  backgroundColor="var(--green-light-1)"
  borderColor="var(--green-light-2)"
  code={`$inspect(user.loading);`}
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
  type="() => Promise<void>"
  description="Refetch the document data."
  backgroundColor="var(--light-pastel-blue-2)"
  borderColor="var(--light-pastel-blue-1)"
  code={`await user.refetch();`}
/>

<Param
  name="get_doc_ref"
  type="() => Promise<DocumentReference | undefined | null>"
  description="Get the document reference."
  backgroundColor="var(--light-pastel-blue-2)"
  borderColor="var(--light-pastel-blue-1)"
  code={`await user.refetch();`}
/>

<h2>More examples:</h2>

<Example
  text="Fetch a document & listen for changes"
  code={DocumentStateDemo3Code}
>
  <DocumentStateDemo3 />
</Example>

<Example text="Query a document in a collection" code={DocumentStateDemo2Code}>
  <DocumentStateDemo2 />
</Example>

<style>
  .title {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
