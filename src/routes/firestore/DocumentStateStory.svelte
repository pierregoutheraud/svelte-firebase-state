<script lang="ts">
	import { DocumentState } from "$lib/DocumentState.svelte.js";
	import { collection, query, where } from "firebase/firestore";
	import { firestore } from "../firebase.js";
	import { type FirestoreUser } from "./states.svelte.js";

	const user = new DocumentState<FirestoreUser>({
		firestore,
		listen: true,
		// path: "users/rXY7P670aVJiqrrsyw8z"
		query: (u) => {
			return query(
				collection(firestore, "users"),
				where("name", "==", "Pierre")
			);
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
