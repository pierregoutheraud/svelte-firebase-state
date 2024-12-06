<script lang="ts">
	import CodeSnippet from "../../../www-components/CodeSnippet/CodeSnippet.svelte";
	import Example from "../../../www-components/Example/Example.svelte";
	import DocumentStateDemo1 from "./DocumentStateDemo1.svelte";
	import DocumentStateDemo1Code from "./DocumentStateDemo1.svelte?raw";
	import DocumentStateDemo2 from "./DocumentStateDemo2.svelte";
	import DocumentStateDemo2Code from "./DocumentStateDemo2.svelte?raw";
</script>

<p>
	<span>DocumentState</span> -> Manages a single Firestore document.<br />Fetch
	data, listen for real-time updates and save changes to Firebase.
</p>

<CodeSnippet
	language="typescript"
	code={`type DocumentStateOptionsBase = {
	auth?: Auth;
	firestore: Firestore;
	listen?: boolean;
};

type PathParam =
	| string
	| null
	| undefined
	| ((user: User | null) => string | null | undefined);

type QueryParamsFn = (user: User | null) => QueryConstraint[];

type DocumentStateOptions = DocumentStateOptionsBase &
	(
		| {
				path?: never;
				collectionPath?: PathParam;
				query?: QueryParamsFn;
		  }
		| {
				path?: PathParam;
				collectionPath?: never;
				query?: never;
		  }
	);
`}
/>

<Example
	text="Example: Fetch a document & listen for changes"
	code={DocumentStateDemo2Code}
>
	<DocumentStateDemo2 />
</Example>

<Example
	text="Example: Query a document in a collection"
	code={DocumentStateDemo1Code}
>
	<DocumentStateDemo1 />
</Example>
