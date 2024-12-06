<script lang="ts">
	import { DocumentState } from "$lib/DocumentState.svelte.js";
	import { firestore } from "../../../www-lib/firebase.js";

	interface User {
		name: string;
		age: number;
	}

	const user = new DocumentState<User>({
		firestore,
		listen: true,
		path: "users_2/X4BqYa3gKF5Oku0NqAh8"
	});

	function handleChange() {
		if (user.data) {
			user.data.age = Math.floor(Math.random() * 100);
			// Save to firebase
			user.save();
		}
	}
</script>

<div class="demo">
	{#if user.data}
		<div class="user">
			<img
				src={`https://identicons-server.fly.dev/${user.data.name}?pixelSize=4&width=30&height=30`}
				alt="user"
			/>
			<p>{user.data.name}</p>
			<p>{user.data.age}</p>
		</div>
	{/if}
	<button onclick={handleChange}>Update age</button>
</div>

<style>
	.demo {
		background: var(--gray-2);
		padding: 40px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.user {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.demo button {
		width: fit-content;
		text-align: center;
		height: 21px;
		padding: 0;
		flex-shrink: 0;

		cursor: pointer;
		border: 1px solid black;
		padding: 0 8px;
		font-size: 16px;
		background: black;
		color: white;
	}
</style>
