import { type Auth, type User } from "firebase/auth";
import {
	ref,
	type Database,
	onValue,
	type Unsubscribe,
	type DatabaseReference,
	set,
	get
} from "firebase/database";
import { effect_deps, get_firebase_user_promise } from "./utils.svelte.js";
import { SubscriberState } from "./SubscriberState.svelte.js";

type PathFunctionOrString = ((user: User | null) => string) | string;

interface NodeStateOptions {
	auth?: Auth;
	database: Database;
	path: PathFunctionOrString;
	autosave?: boolean;
	listen?: boolean;
}

export class NodeState<T> extends SubscriberState<T> {
	private readonly auth?: Auth;
	private readonly database: Database;
	private readonly pathFunctionOrString: PathFunctionOrString;
	private readonly listenAtStart: boolean;
	private readonly autosave: boolean;

	private unsub?: Unsubscribe;
	private firstFetchDone: boolean = false;
	private isUpdatingFromDB: boolean = true;
	private nodeRef?: DatabaseReference;
	private readonly getUser: Promise<User | null>;
	private cleanup: () => void;

	constructor({
		auth,
		database,
		path: pathFunctionOrString,
		listen: listenAtStart = false,
		autosave = false
	}: NodeStateOptions) {
		super();

		this.auth = auth;
		this.database = database;
		this.pathFunctionOrString = pathFunctionOrString;
		this.autosave = autosave;
		this.listenAtStart = listenAtStart;

		this.getUser = get_firebase_user_promise(this.auth);
		this.cleanup = this.initialize_effects();
	}

	async get_path_string() {
		const user = await this.getUser;
		if (typeof this.pathFunctionOrString === "function") {
			return this.pathFunctionOrString(user);
		} else {
			return this.pathFunctionOrString;
		}
	}

	async start() {
		const pathStr = await this.get_path_string();
		this.nodeRef = ref(this.database, pathStr);

		if (this.listenAtStart) {
			this.listen();
		} else {
			this.fetch_data();
		}
	}

	listen() {
		if (!this.nodeRef) {
			return;
		}

		this.unsub = onValue(
			this.nodeRef,
			(snapshot) => {
				this.isUpdatingFromDB = true;
				this.value = snapshot.val() as T;
				// this.firstFetchDone = true;
			},
			(error) => {
				console.error("NodeState.svelte | listen | error", error);
			}
		);
	}

	async fetch_data() {
		if (!this.nodeRef) {
			return;
		}

		const snapshot = await get(this.nodeRef);
		this.value = snapshot.val() as T;
	}

	stop(): void {
		this.unsub?.();
		this.unsub = undefined;
	}

	private initialize_effects(): () => void {
		return () => {};

		// return $effect.root(() => {
		// 	effect_deps(
		// 		() => {
		// 			console.log("effect_deps", this.value?.age);
		// 			this.save_data_to_firebase();
		// 			// this.initialize_effects();
		// 		},
		// 		() => [(this.value as any)?.age]
		// 	);

		/*
			$effect(() => {
				console.log(this.value?.age);
			});

			$effect(() => {
				if (!this.value) {
					return () => console.log("$effect cleanup 1");
				}

				console.log("$effect", this.value.age);

				if (!this.value || this.isUpdatingFromDB) {
					this.isUpdatingFromDB = false;
					return () => console.log("$effect cleanup 2");
				}

				console.log("SAVE VALUE");
				this.save_data_to_firebase();
				// this.initialize_effects();
				//
				return () => console.log("$effect cleanup 3");
			});
      */

		// 	return () => console.log("$effect.root cleanup");
		// });
		//
		// return $effect.root(() => {
		// 	$effect(() => {
		// 		console.log("$effect", this.value, this.isUpdatingFromDB);
		//
		// 		// Watch all keys in the object
		// 		Object.keys(this.value || {}).forEach((key) => {
		// 			console.log("key", key);
		// 		});
		//
		// 		if (!this.value || this.isUpdatingFromDB) {
		// 			this.isUpdatingFromDB = false;
		// 			return () => {};
		// 		}
		//
		// 		console.log("SAVE VALUE");
		// 		this.save_data_to_firebase();
		//
		// 		return () => {};
		// 	});
		//
		// 	return () => {};
		// });
		//
		// return () => {};
	}

	get data(): T | undefined {
		return this.value;
	}

	set data(newValue: T | undefined) {
		this.value = newValue;
		if (this.autosave) {
			this.save_data_to_firebase();
		}
	}

	private save_data_to_firebase() {
		if (!this.nodeRef || !this.value) {
			return;
		}
		set(this.nodeRef, this.value);
	}

	public save<K extends keyof T>(
		key?: K,
		update?: T[K] | ((prevValue: T[K]) => T[K])
	): void {
		if (!key) {
			this.save_data_to_firebase();
			return;
		}

		if (!update || !this.nodeRef || !this.value) {
			return;
		}

		let newValue: T[K];
		if (typeof update === "function") {
			const updateFn = update as (prevValue: T[K]) => T[K];
			const prevValue = this.value[key];
			newValue = updateFn(prevValue);
		} else {
			newValue = update;
		}

		this.value[key] = newValue as NonNullable<T>[K];
		this.save_data_to_firebase();
	}

	public dispose(): void {
		this.stop();
		this.cleanup();
	}
}
