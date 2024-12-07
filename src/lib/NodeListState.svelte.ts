import { type Auth, type User } from "firebase/auth";
import {
	ref,
	type Database,
	onValue,
	type Unsubscribe,
	type DatabaseReference,
	QueryConstraint,
	query,
	type Query,
	get,
	DataSnapshot
} from "firebase/database";
import { get_firebase_user_promise } from "./utils.svelte.js";
import { SubscriberState } from "./SubscriberState.svelte.js";

type PathFunctionOrString = ((user: User | null) => string) | string;

interface CreateNodeStateOptions {
	auth?: Auth;
	database: Database;
	path: PathFunctionOrString;
	query?: (user: User | null) => QueryConstraint[];
	listen?: boolean;
}

export class NodeListState<T> extends SubscriberState<T[]> {
	private readonly auth?: Auth;
	private readonly database: Database;
	private readonly pathFunctionOrString: PathFunctionOrString;
	private readonly listenAtStart: boolean;
	private readonly queryParamsFn?: (user: User | null) => QueryConstraint[];

	private unsub?: Unsubscribe;
	private listRef?: DatabaseReference;
	private readonly getUser: Promise<User | null>;
	private queryRef?: Query;

	constructor({
		auth,
		database,
		path: pathFunctionOrString,
		listen: listenAtStart = false,
		query: queryParamsFn
	}: CreateNodeStateOptions) {
		super();

		this.auth = auth;
		this.database = database;
		this.pathFunctionOrString = pathFunctionOrString;
		this.listenAtStart = listenAtStart;
		this.queryParamsFn = queryParamsFn;
		this.getUser = get_firebase_user_promise(this.auth);
	}

	async start() {
		const user = await this.getUser;

		let pathStr: string;
		if (typeof this.pathFunctionOrString === "function") {
			pathStr = this.pathFunctionOrString(user);
		} else {
			pathStr = this.pathFunctionOrString;
		}

		this.listRef = ref(this.database, pathStr);
		const queryParams = this.queryParamsFn ? this.queryParamsFn(user) : [];
		this.queryRef = query(this.listRef, ...queryParams);

		if (this.listenAtStart) {
			this.listen();
		} else {
			this.fetch_data();
		}
	}

	createArrayFromSnapshot(snapshot: DataSnapshot) {
		const arr: T[] = [];
		snapshot.forEach((childSnapshot) => {
			// const childKey = childSnapshot.key;
			const childData = childSnapshot.val() as T;
			arr.push(childData);
		});
		return arr;
	}

	listen() {
		if (!this.queryRef) {
			throw new Error("Query reference is not set");
		}
		this.unsub = onValue(this.queryRef, (snapshot) => {
			this.value = this.createArrayFromSnapshot(snapshot);
		});
	}

	async fetch_data() {
		if (!this.queryRef) {
			throw new Error("Query reference is not set");
		}

		const snapshot = await get(this.queryRef);
		this.value = this.createArrayFromSnapshot(snapshot);
	}

	refetch(): Promise<void> {
		return this.fetch_data();
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
