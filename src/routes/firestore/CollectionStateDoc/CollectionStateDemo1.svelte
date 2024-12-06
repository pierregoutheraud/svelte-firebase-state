<script lang="ts">
	import { addDoc, collection, orderBy } from "firebase/firestore";
	import { CollectionState } from "$lib/CollectionState.svelte.js";
	import { firestore } from "../../../www-lib/firebase.js";

	interface User {
		name: string;
	}

	const users = new CollectionState<User>({
		firestore,
		listen: true,
		path: "users",
		query: () => [orderBy("name", "asc")]
	});

	let name = $state("Mickey");

	function handleAdd() {
		users.add({ name });
	}

	// svelte-firebase-state adds the id of the document in the data
	function handleRemove(user: User & { id: string }) {
		users.delete(user.id);
	}

	function handleAddRandom() {
		// You can also use your own code to edit the database,
		// the data state will be updated.
		const randomName = Math.random().toString(36).substring(7);
		addDoc(collection(firestore, "users"), { name: randomName });
	}
</script>

<div class="demo">
	<div class="form">
		<input type="text" bind:value={name} />
		<button onclick={handleAdd}>Add user</button>
		<button onclick={handleAddRandom}>Add a random user</button>
	</div>

	{#if users.data?.length}
		<div class="users">
			{#each users.data as user (user.id)}
				<div class="user">
					<img
						src={`https://identicons-server.fly.dev/${user.name}?pixelSize=4&width=30&height=30`}
						alt="user"
					/>
					<p>{user.name}</p>
					<button onclick={() => handleRemove(user)}>Remove user</button>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.demo {
		background: var(--gray-2);
		padding: 40px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.users {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.user {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 300px;
	}
	.user button {
		text-align: center;
		height: 21px;
		padding: 0;
		margin-left: auto;
		flex-shrink: 0;
	}

	.demo input,
	.demo button {
		height: 30px;
		padding: 0 10px;
	}

	.demo input {
		border: 1px solid black;
	}
	.demo button {
		cursor: pointer;
		border: 1px solid black;
		padding: 0 8px;
		font-size: 16px;
		background: black;
		color: white;
	}

	.form {
		display: flex;
		gap: 10px;
	}
</style>
