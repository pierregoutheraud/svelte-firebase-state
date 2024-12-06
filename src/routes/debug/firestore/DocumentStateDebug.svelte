<script lang="ts">
	import { DocumentState } from "$lib/DocumentState.svelte.js";
	import { collection, query, where } from "firebase/firestore";
	import { type FirestoreUser } from "./states.svelte.js";
	import { firestore } from "../../../www-lib/firebase.js";

	const user = new DocumentState<FirestoreUser>({
		firestore,
		listen: true,
		// path: "users/rXY7P670aVJiqrrsyw8z"
		collectionPath: "users_2",
		query: (u) => {
			return [where("name", "==", "Anna")];
		}
	});

	$inspect(user.data);

	function onclick() {
		if (user.data) {
			user.data.age++;
			user.save();
		}
	}
</script>

<div>
	{JSON.stringify(user.data)}
	<button {onclick}>Change</button>
</div>

<style>
</style>
