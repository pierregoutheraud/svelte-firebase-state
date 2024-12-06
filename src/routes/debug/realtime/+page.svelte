<script lang="ts">
	import { NodeState } from "$lib/NodeState.svelte.js";
	import { NodeListState } from "$lib/NodeListState.svelte.js";
	import { ChildState, ParentState } from "$lib/test.svelte.js";
	import { rdb } from "../../../www-lib/firebase.js";
	import { user, type RealtimeUser } from "./states.svelte.js";

	export const users = new NodeListState<RealtimeUser>({
		database: rdb,
		path: async () => "users"
	});

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

	$inspect(users.data);
	$inspect(users.derived);

	// let testState = new ChildState();
	// $inspect("value", testState.value);
	// $inspect("derived", testState.derived);
	// $inspect("users", users.list);
</script>

<!-- <p>value={testState.value}</p> -->
<!-- <p>derived={testState.derived}</p> -->
<!---->
<!-- <button -->
<!-- 	onclick={() => { -->
<!-- 		if (testState.value === undefined) { -->
<!-- 			testState.value = 1; -->
<!-- 		} else { -->
<!-- 			testState.value++; -->
<!-- 		} -->
<!-- 	}}>Increment</button -->
<!-- > -->

<!-- {#if users.list} -->
<!-- 	{#each users.list as user} -->
<!-- 		<div> -->
<!-- 			<p>{user.name}</p> -->
<!-- 			<p>{user.age}</p> -->
<!-- 		</div> -->
<!-- 	{/each} -->
<!-- {/if} -->

<!-- {JSON.stringify(users.data)} -->
<!-- {JSON.stringify(users.derived)} -->
<!-- {JSON.stringify(users.list)} -->
<!-- {JSON.stringify(users.array)} -->

<!-- {user.data?.name} -->
<!-- {#if user.data?.name} -->
<!-- 	<input type="text" bind:value={user.data.name} /> -->
<!-- {/if} -->

<!-- <div> -->
<!-- 	{JSON.stringify(user.data)} -->
<!-- 	<!-- {JSON.stringify(user2.data)} -->
<!-- </div> -->
<!---->
<!-- <div> -->
<!-- 	<button onclick={handleChangeAge}>Increment user1 age</button> -->
<!-- 	<button onclick={handleChangeName}>Change name mutate</button> -->
<!-- 	<button onclick={handleChangeNameReassign}>Change name re-assign</button> -->
<!-- </div> -->
