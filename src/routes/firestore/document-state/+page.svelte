<script lang="ts">
  import CodeSnippet from "../../../www-components/CodeSnippet/CodeSnippet.svelte";
  import Example from "../../../www-components/Example/Example.svelte";
  import DocumentStateDemo1 from "./DocumentStateDemo1.svelte";
  import DocumentStateDemo1Code from "./DocumentStateDemo1.svelte?raw";
  import DocumentStateDemo2 from "./DocumentStateDemo2.svelte";
  import DocumentStateDemo2Code from "./DocumentStateDemo2.svelte?raw";
  import DocumentStateDemo3 from "./DocumentStateDemo3.svelte";
  import DocumentStateDemo3Code from "./DocumentStateDemo3.svelte?raw";
</script>

<div class="title">
  <p>
    <span>DocumentState</span> -> Manages a single Firestore document.<br
    />Fetch data, listen for real-time updates and save changes to Firebase.
  </p>
</div>

<h2>Quick example:</h2>

<Example code={DocumentStateDemo3Code}>
  <DocumentStateDemo3 />
</Example>

<h2>Parameters:</h2>

<div class="param">
  <p>
    <span>auth:</span>The firebase auth instance (optional).
  </p>
  <CodeSnippet
    language="typescript"
    code={`import { auth } from "./firebase.js"; // Your firebase auth instance

const user = new DocumentState<DbUser>({
  auth, // <-
  firestore,

  // ->Use the current user in the path
  path: currentUser => \`users/\${currentUser?.uid}\`, 
});`}
  />
</div>

<div class="param">
  <p>
    <span>firestore:</span> The firebase firestore instance (required).
  </p>
</div>

<div class="param">
  <p>
    <span>listen:</span> Listen for real-time updates (optional - default: false).
  </p>
</div>

<div class="param">
  <p>
    <span>path:</span> The path to the document (optional).
  </p>
</div>

<div class="param">
  <p>
    <span>collectionPath:</span> The path to the collection (optional).<br />
    <span>query:</span> Function that returns the query constraints (optional).<br
    />
    Both params should be used together and without the path param.
  </p>
  <CodeSnippet
    language="typescript"
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
</div>

<div class="param">
  <p>
    <span>fromFirestore:</span> Function that converts the Firestore data to the
    app data (optional)
  </p>

  <CodeSnippet
    language="typescript"
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
    const [firstname, lastname] = doc.name.split(" ");
    return {
      ...doc.data(),
      firstname,
      lastname,
      id
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
</div>

<div class="param">
  <p>
    <span>toFirestore:</span> Function that converts the app data the firestore data
    (optional)
  </p>

  <CodeSnippet
    language="typescript"
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
</div>

<h2>More examples:</h2>

<Example
  text="Fetch a document & listen for changes"
  code={DocumentStateDemo1Code}
>
  <DocumentStateDemo1 />
</Example>

<Example text="Query a document in a collection" code={DocumentStateDemo2Code}>
  <DocumentStateDemo2 />
</Example>

<style>
  .title,
  .param {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .param {
    border: 2px solid var(--gray-3);
    padding: 30px;
    background: var(--gray-2);
  }
</style>
