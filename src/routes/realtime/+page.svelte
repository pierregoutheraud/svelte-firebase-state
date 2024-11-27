<script lang="ts">
	import { NodeState } from "$lib/realtime.svelte.js";
	import { rdb } from "../firebase.js";
	import { user, type RealtimeUser } from "./states.svelte.js";

	const user2 = new NodeState<RealtimeUser>({
		database: rdb,
		path: async () => "users/2",
		autosave: true
	});

	function handleChangeAge() {
		if (!user.data) {
			return;
		}
		// user.save("age", (age) => age + 1);
		user.data.age++;
	}

	function handleChangeName() {
		if (!user.data) {
			return;
		}

		user.data = {
			...user.data,
			name: "John Doe" + Math.random()
		};
		// user.data.name = "John Doe" + Math.random();
	}

	function handleChangeNameReassign() {
		if (!user.data) {
			return;
		}
		user.data = {
			...user.data,
			name: "John Doe" + Math.random()
		};
	}
</script>

<!-- {user.data?.name} -->
<!-- {#if user.data?.name} -->
<!-- 	<input type="text" bind:value={user.data.name} /> -->
<!-- {/if} -->

<div>
	{JSON.stringify(user.data)}
	<!-- {JSON.stringify(user2.data)} -->
</div>

<div>
	<button onclick={handleChangeAge}>Increment user1 age</button>
	<button onclick={handleChangeName}>Change name mutate</button>
	<button onclick={handleChangeNameReassign}>Change name re-assign</button>
</div>
