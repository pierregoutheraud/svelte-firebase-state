import { type Auth, type User } from "firebase/auth";
import {
	ref,
	type Database,
	onValue,
	type Unsubscribe,
	type DatabaseReference,
	set
} from "firebase/database";
import { get_firebase_user_promise } from "./utils.svelte.js";
import { SubscriberState } from "./SubscriberState.svelte.js";
import { SvelteMap } from "svelte/reactivity";

interface CreateNodeStateOptions {
	auth?: Auth;
	database: Database;
	path: (user: User | null) => Promise<string>;
	autosave?: boolean;
}

export class NodeListState<T> extends SubscriberState<Record<string, T>> {
	private unsub?: Unsubscribe;
	private listRef?: DatabaseReference;
	private readonly getUser: Promise<User | null>;

	// private _list: T[] = $state([]);
	// private _map: Map<string, T> = $state(new Map());
	derived = $derived(this.value ? this.value : {});

	constructor(private options: CreateNodeStateOptions) {
		super();
		this.getUser = get_firebase_user_promise(options.auth);
		// this.initialize_effects();
	}

	// private initialize_effects(): () => void {
	// 	return $effect.root(() => {
	// 		// $derived does not work, so I use $state + $effect
	// 		$effect(() => {
	// 			this._map = this.value
	// 				? new Map(Object.entries(this.value))
	// 				: new Map();
	// 			this._list = this.value ? Object.values(this.value) : [];
	// 		});
	// 	});
	// }

	// get list(): T[] {
	// 	return this._list;
	// }
	//
	// get map(): Map<string, T> {
	// 	return this._map;
	// }

	async start() {
		const user = await this.getUser;
		const pathStr = await this.options.path(user);
		this.listRef = ref(this.options.database, pathStr);
		this.unsub = onValue(this.listRef, (snapshot) => {
			this.value = snapshot.val();

			// const data = snapshot.toJSON() as Record<string, T> | null;
			// if (!data) {
			// 	this.value = new SvelteMap();
			// 	return;
			// }
			// this.value = new SvelteMap(Object.entries(data));

			// const newList: T[] = [];
			// snapshot.forEach((childSnapshot) => {
			// 	// const childKey = childSnapshot.key;
			// 	const childData = childSnapshot.val();
			// 	newList.push(childData);
			// });
			// this.value = newList;
		});
	}

	stop(): void {
		this.unsub?.();
		this.unsub = undefined;
	}

	get data(): Map<string, T> | undefined {
		return this.value;
	}

	get array(): T[] {
		return this.list;
	}

	// set data(newValue: T[] | undefined) {
	// 	this.value = newValue;
	// 	if (this.options.autosave) {
	// 		this.save_data_to_firebase();
	// 	}
	// }

	// private save_data_to_firebase() {
	// 	if (!this.listRef || !this.value) {
	// 		return;
	// 	}
	// 	set(this.listRef, this.value);
	// }

	public dispose(): void {
		this.stop();
	}
}
