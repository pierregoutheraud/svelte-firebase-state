import { NodeListState } from "$lib/NodeListState.svelte.js";
import { NodeState } from "$lib/NodeState.svelte.js";
import { rdb } from "../../../www-lib/firebase.js";

export interface RealtimeUser {
	id: string;
	name: string;
	age: number;
}

export const user = new NodeState<RealtimeUser>({
	database: rdb,
	path: async () => "users/1"
});

export const users = new NodeListState<RealtimeUser>({
	database: rdb,
	path: async () => "users"
});
