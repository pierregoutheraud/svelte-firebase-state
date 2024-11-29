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

interface CreateNodeStateOptions {
	auth?: Auth;
	database: Database;
	path: (user: User | null) => Promise<string>;
	autosave?: boolean;
}

export class NodeState<T> extends SubscriberState<T> {
	private unsub?: Unsubscribe;
	private firstFetchDone: boolean = false;
	private isUpdatingFromDB: boolean = true;
	private nodeRef?: DatabaseReference;
	private readonly getUser: Promise<User | null>;
	private cleanup: () => void;

	constructor(private options: CreateNodeStateOptions) {
		super();
		this.getUser = get_firebase_user_promise(options.auth);
		this.cleanup = this.initialize_effects();
	}

	async start() {
		const user = await this.getUser;
		const pathStr = await this.options.path(user);
		this.nodeRef = ref(this.options.database, pathStr);
		this.unsub = onValue(this.nodeRef, (snapshot) => {
			this.isUpdatingFromDB = true;
			this.value = snapshot.val() as T;
			this.firstFetchDone = true;
		});
	}

	stop(): void {
		this.unsub?.();
		this.unsub = undefined;
	}

	private initialize_effects(): () => void {
		return () => {};

		// return $effect.root(() => {
		// $effect(() => {
		//     console.log(1, "effect root", this._data, this.isUpdatingFromDB);
		//     if (!this.isUpdatingFromDB) {
		//         console.log("SAV", this._data);
		//     }
		//
		//     this.isUpdatingFromDB = false;
		// });
		// $effect(() => {
		//     console.log(this.data?.age);
		//     // this.save_data_to_firebase();
		// });
		// Object.keys(this._data || {}).forEach((key) => {
		//     $effect(() => {
		//         if (this._data) {
		//             console.log("data", this._data[key as keyof T]);
		//         }
		//     });
		// });
		// Object.keys(this._data || {}).forEach((key) => {
		//     // console.log(this._data?.[key]);
		//     this._data?.[key];
		// });
		// console.log(1, "isUpdatingFromDB", this.isUpdatingFromDB);
		//
		// if (this.nodeRef) {
		//     console.log(2);
		//     set(this.nodeRef, this._data);
		// }
		//
		// this.isUpdatingFromDB = false;
		//
		// return () => console.log("cleanup");
		// console.log("data", this._data?.["age"]);
		//
		// Object.keys(this._data || {}).forEach((key) => {
		//     $effect(() => {
		//         console.log("data", this._data?.[key]);
		//     });
		// });
		return () => {
			console.log("effect root cleanup");
		};
		// });
	}

	get data(): T | undefined {
		return this.value;
	}

	set data(newValue: T | undefined) {
		this.value = newValue;
		if (this.options.autosave) {
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
