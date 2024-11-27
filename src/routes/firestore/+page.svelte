<script lang="ts">
	import { firestoreUsersState } from "./states.svelte.js";

	let name = $state("John");
	let age = $state(0);

	function onAdd() {
		firestoreUsersState.add({
			name,
			age
		});

		firestoreUsersState.data = [
			...(firestoreUsersState.data || []),
			{
				name,
				age
			}
		];
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
