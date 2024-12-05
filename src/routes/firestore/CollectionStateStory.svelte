<script lang="ts">
	import { collection, query } from "firebase/firestore";
	import { firestore } from "../firebase.js";
	import { type FirestoreUser } from "./states.svelte.js";
	import { CollectionState } from "$lib/CollectionState.svelte.js";

	const firestoreUsersState = new CollectionState<FirestoreUser>({
		firestore,
		listen: true,
		// path: async (u) => "users"
		query: async () => {
			return query(collection(firestore, "users"));
		}
	});

	let name = $state("John");
	let age = $state(0);

	function onAdd() {
		console.log("onAdd", name, age);
		firestoreUsersState.add({
			name,
			age
		});

		// firestoreUsersState.data = [
		// 	...(firestoreUsersState.data || []),
		// 	{
		// 		name,
		// 		age
		// 	}
		// ];
	}
</script>

<div>
	{#if firestoreUsersState.data}
		{#each firestoreUsersState.data as user}
			<div>{user.name} - {user.age}</div>
		{/each}
	{/if}
</div>

<div>
	<input type="text" bind:value={name} />
	<input type="number" bind:value={age} />
	<button onclick={onAdd}>Add</button>
</div>

<style>
</style>
