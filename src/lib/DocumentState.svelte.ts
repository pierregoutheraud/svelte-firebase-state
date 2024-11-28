import { type User } from "firebase/auth";
import {
	Firestore,
	Query,
	type DocumentData,
	onSnapshot,
	type Unsubscribe,
	QueryDocumentSnapshot,
	doc,
	getDoc,
	DocumentReference,
	setDoc
} from "firebase/firestore";
import { type Auth } from "firebase/auth";
import { get_firebase_user_promise } from "./utils.svelte.js";
import { SubscriberState } from "./SubscriberState.svelte.js";

type DocumentStateOptionsBase = {
	auth?: Auth;
	firestore: Firestore;
	listen?: boolean;
};

type DocumentStateOptions = DocumentStateOptionsBase &
	(
		| {
				query?: (user: User | null) => Promise<Query>;
				path?: never;
		  }
		| {
				path?: string | ((user: User | null) => Promise<string>);
				query?: never;
				listen?: boolean;
		  }
	);

export class DocumentState<T = DocumentData> {
	private dataState: SubscriberState<T>;
	private docRef: DocumentReference | undefined;
	private unsub: Unsubscribe | undefined;
	private loading = $state(false);

	private readonly auth: Auth | undefined;
	private readonly firestore: Firestore;
	private readonly pathFunctionOrString?:
		| string
		| ((user: User | null) => Promise<string>);
	private readonly listenAtStart: boolean;
	private readonly getUser: Promise<User | null>;

	constructor({
		auth,
		firestore,
		query: query_fn,
		path: pathFunctionOrString,
		listen: listenAtStart = false
	}: DocumentStateOptions) {
		this.auth = auth;
		this.firestore = firestore;
		this.pathFunctionOrString = pathFunctionOrString;
		this.listenAtStart = listenAtStart;
		this.getUser = get_firebase_user_promise(this.auth);
		this.dataState = new SubscriberState<T>({
			start: this.start.bind(this),
			stop: this.stop.bind(this)
		});
	}

	private async getQueryRef(): Promise<typeof this.docRef | undefined> {
		if (this.docRef) {
			return this.docRef;
		}

		const user = await this.getUser;

		if (this.pathFunctionOrString) {
			let pathStr: string;
			if (typeof this.pathFunctionOrString === "function") {
				pathStr = await this.pathFunctionOrString(user);
			} else {
				pathStr = this.pathFunctionOrString;
			}
			const pathArray: [string, ...string[]] = pathStr.split("/") as [
				string,
				...string[]
			];

			this.docRef = doc(this.firestore, ...pathArray);
		}

		return this.docRef;
	}

	private mapData(doc: QueryDocumentSnapshot<DocumentData, DocumentData>): T {
		return doc.data() as T;
	}

	private async fetch_data(): Promise<void> {
		this.loading = true;

		const docRef = await this.getQueryRef();
		if (!docRef) {
			return;
		}

		const docSnap = await getDoc(docRef);
		this.dataState.value = docSnap.data() as T;

		this.loading = false;
	}

	private async listen(
		callback?: (d: T | null) => void
	): Promise<Unsubscribe | undefined> {
		if (this.unsub) {
			return;
		}

		const docRef = await this.getQueryRef();
		if (!docRef) {
			return;
		}

		this.unsub = onSnapshot(docRef, (docSnap) => {
			if (!docSnap) {
				callback?.(null);
				this.dataState.value = undefined;
				return;
			}
			const newData = docSnap.data() as T;
			this.dataState.value = newData;
			callback?.(this.dataState.value);
		});
		return this.unsub;
	}

	private start(): void {
		if (this.listenAtStart) {
			this.listen();
		} else {
			this.fetch_data();
		}
	}

	private stop(): void {
		if (this.unsub) {
			this.unsub();
			this.unsub = undefined;
		}
	}

	get data(): T | undefined {
		return this.dataState.value;
	}

	set data(data: T | undefined) {
		this.dataState.value = data;
	}

	get isLoading(): boolean {
		return this.loading;
	}

	refetch(): Promise<void> {
		return this.fetch_data();
	}

	save_data_to_firebase(): void {
		if (!this.docRef) {
			return;
		}
		return setDoc(this.docRef, this.dataState.value || null, { merge: true });
	}

	public save<K extends keyof T>(
		key?: K,
		update?: T[K] | ((prevValue: T[K]) => T[K])
	): void {
		if (!key) {
			this.save_data_to_firebase();
			return;
		}

		if (!update || !this.docRef || !this.dataState.value) {
			return;
		}
		let newValue: T[K];
		if (typeof update === "function") {
			const updateFn = update as (prevValue: T[K]) => T[K];
			const prevValue = this.dataState.value[key];
			newValue = updateFn(prevValue);
		} else {
			newValue = update;
		}

		this.dataState.value[key] = newValue as NonNullable<T>[K];

		this.save_data_to_firebase();
	}
}
