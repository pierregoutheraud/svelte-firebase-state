import { NodeState } from "$lib/NodeState.svelte.js";
import { rdb } from "../firebase.js";

export interface RealtimeUser {
	id: string;
	name: string;
	age: number;
}

export const user = new NodeState<RealtimeUser>({
	database: rdb,
	path: async () => "users/1"
});
