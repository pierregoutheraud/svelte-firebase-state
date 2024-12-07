import { type Auth, type User } from "firebase/auth";
import {
	ref,
	type Database,
	onValue,
	type Unsubscribe,
	type DatabaseReference,
	QueryConstraint,
	query
} from "firebase/database";
import { get_firebase_user_promise } from "./utils.svelte.js";
import { SubscriberState } from "./SubscriberState.svelte.js";

interface CreateNodeStateOptions {
	auth?: Auth;
	database: Database;
	path: (user: User | null) => Promise<string>;
	autosave?: boolean;
	listen?: boolean;
	query?: (user: User | null) => QueryConstraint[];
}

export class NodeListState<T> extends SubscriberState<T[]> {
	private readonly auth?: Auth;
	private readonly database: Database;
	private readonly path: (user: User | null) => Promise<string>;
	private readonly autosave: boolean;
	private readonly listen: boolean;
	private readonly queryParamsFn?: (user: User | null) => QueryConstraint[];

	private unsub?: Unsubscribe;
	private listRef?: DatabaseReference;
	private readonly getUser: Promise<User | null>;

	constructor({
		auth,
		database,
		path,
		autosave = false,
		listen = false,
		query: queryParamsFn
	}: CreateNodeStateOptions) {
		super();

		this.auth = auth;
		this.database = database;
		this.path = path;
		this.autosave = autosave;
		this.listen = listen;
		this.queryParamsFn = queryParamsFn;

		this.getUser = get_firebase_user_promise(auth);
	}

	async start() {
		const user = await this.getUser;
		const pathStr = await this.path(user);
		this.listRef = ref(this.database, pathStr);
		const queryParams = this.queryParamsFn ? this.queryParamsFn(user) : [];
		const queryRef = query(this.listRef, ...queryParams);

		this.unsub = onValue(queryRef, (snapshot) => {
			const arr: T[] = [];
			snapshot.forEach((childSnapshot) => {
				// const childKey = childSnapshot.key;
				const childData = childSnapshot.val() as T;
				arr.push(childData);
			});

			this.value = arr;
		});
	}

	stop(): void {
		this.unsub?.();
		this.unsub = undefined;
	}

	get data(): T[] | null | undefined {
		return this.value;
	}

	set data(data: T[] | undefined) {
		this.value = data;
	}

	public dispose(): void {
		this.stop();
	}
}
