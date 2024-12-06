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

	function handleAdd() {
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

	function handleRemove(user: FirestoreUser) {
		firestoreUsersState.delete(user.id);
	}

	$inspect(firestoreUsersState.data);
</script>

<div class="users">
	{#if firestoreUsersState.data}
		{#each firestoreUsersState.data as user}
			<div class="user">
				<p>{user.name} - {user.age}</p>
				<button onclick={() => handleRemove(user)}>Remove</button>
			</div>
		{/each}
	{/if}
</div>

<div>
	<input type="text" bind:value={name} />
	<input type="number" bind:value={age} />
	<button onclick={handleAdd}>Add</button>
</div>

<style>
	.users {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.user {
		display: flex;
		gap: 10px;
		align-items: center;
	}
</style>
