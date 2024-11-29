<script lang="ts">
	import { DocumentState } from "$lib/DocumentState.svelte.js";
	import { collection, query, where } from "firebase/firestore";
	import { firestore } from "../firebase.js";
	import { firestoreUsersState, type FirestoreUser } from "./states.svelte.js";

	const user = new DocumentState<FirestoreUser>({
		firestore,
		listen: true,
		// path: "users/rXY7P670aVJiqrrsyw8z"
		query: (u) => {
			if (u) {
				// throw new Error("User already exists");
				return null;
			}
			return query(
				collection(firestore, "users"),
				where("name", "==", "Pierre")
			);
		}
	});
	$inspect(user.data);

	let name = $state("John");
	let age = $state(0);

	// function onAdd() {
	// 	firestoreUsersState.add({
	// 		name,
	// 		age
	// 	});
	//
	// 	firestoreUsersState.data = [
	// 		...(firestoreUsersState.data || []),
	// 		{
	// 			name,
	// 			age
	// 		}
	// 	];
	// }
</script>

<main>
	<!-- <div> -->
	<!-- 	{#if firestoreUsersState.data} -->
	<!-- 		{#each firestoreUsersState.data as user} -->
	<!-- 			<div>{user.name} - {user.age}</div> -->
	<!-- 		{/each} -->
	<!-- 	{/if} -->
	<!-- </div> -->

	<!-- <div> -->
	<!-- 	<input type="text" bind:value={name} /> -->
	<!-- 	<input type="number" bind:value={age} /> -->
	<!-- 	<button onclick={onAdd}>Add</button> -->
	<!-- </div> -->

	<div>
		{JSON.stringify(user.data)}
		<button
			onclick={() => {
				if (user.data) {
					user.data.age++;
					user.save();
				}
			}}>Change</button
		>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
	}

	div {
		margin: 20px;
	}
</style>
