import { type User } from "firebase/auth";
import {
	Firestore,
	Query,
	type DocumentData,
	onSnapshot,
	type Unsubscribe,
	doc,
	getDoc,
	DocumentReference,
	setDoc,
	getDocs
} from "firebase/firestore";
import { type Auth } from "firebase/auth";
import { get_firebase_user_promise } from "./utils.svelte.js";
import { SubscriberState } from "./SubscriberState.svelte.js";

type DocumentStateOptionsBase = {
	auth?: Auth;
	firestore: Firestore;
	listen?: boolean;
};

type PathParam =
	| string
	| null
	| undefined
	| ((user: User | null) => string | null | undefined);
type QueryFn = (user: User | null) => Query | null | undefined;

type DocumentStateOptions = DocumentStateOptionsBase &
	(
		| {
				query?: QueryFn;
				path?: never;
		  }
		| {
				path?: PathParam;
				query?: never;
				listen?: boolean;
		  }
	);

export class DocumentState<T = DocumentData> extends SubscriberState<T | null> {
	private docRef: DocumentReference | undefined;
	private unsub: Unsubscribe | undefined;
	private loading = $state(false);

	private readonly auth?: Auth;
	private readonly firestore: Firestore;
	private readonly pathFunctionOrString?: PathParam;
	private readonly listenAtStart: boolean;
	private readonly getUser: Promise<User | null>;
	private readonly queryFn?: QueryFn;

	constructor({
		auth,
		firestore,
		path: pathFunctionOrString,
		query: queryFn,
		listen: listenAtStart = false
	}: DocumentStateOptions) {
		super();

		this.auth = auth;
		this.firestore = firestore;
		this.pathFunctionOrString = pathFunctionOrString;
		this.listenAtStart = listenAtStart;
		this.getUser = get_firebase_user_promise(this.auth);
		this.queryFn = queryFn;
	}

	start() {
		if (this.listenAtStart) {
			this.listen();
		} else {
			this.fetch_data();
		}
	}

	stop(): void {
		if (this.unsub) {
			this.unsub();
			this.unsub = undefined;
		}
	}

	private async getQueryRef(): Promise<typeof this.docRef | undefined> {
		if (this.docRef) {
			return this.docRef;
		}

		const user = await this.getUser;

		if (this.pathFunctionOrString) {
			let pathStr: string | null | undefined;
			if (typeof this.pathFunctionOrString === "function") {
				pathStr = this.pathFunctionOrString(user);
			} else {
				pathStr = this.pathFunctionOrString;
			}

			if (!pathStr) {
				this.docRef = undefined;
				return this.docRef;
			}

			const pathArray: [string, ...string[]] = pathStr.split("/") as [
				string,
				...string[]
			];

			this.docRef = doc(this.firestore, ...pathArray);
		} else if (this.queryFn) {
			// Run query and get first document ref
			const queryRef = this.queryFn(user);

			if (!queryRef) {
				this.docRef = undefined;
				return this.docRef;
			}

			const querySnapshot = await getDocs(queryRef);
			this.docRef = querySnapshot.docs[0]?.ref;
		}

		return this.docRef;
	}

	private async fetch_data(): Promise<void> {
		this.loading = true;

		const docRef = await this.getQueryRef();
		if (!docRef) {
			this.value = null;
			return;
		}

		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			this.value = null;
		} else {
			this.value = docSnap.data() as T;
		}

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
			if (!docSnap.exists()) {
				callback?.(null);
				this.value = null;
				return;
			}
			const newData = docSnap.data() as T;
			this.value = newData;
			callback?.(this.value);
		});
		return this.unsub;
	}

	get isLoading(): boolean {
		return this.loading;
	}

	refetch(): Promise<void> {
		return this.fetch_data();
	}

	save_data_to_firebase() {
		if (!this.docRef) {
			return;
		}
		return setDoc(this.docRef, this.value || null, { merge: true });
	}

	get data(): T | null | undefined {
		return this.value;
	}

	set data(data: T | undefined) {
		this.value = data;
	}

	public save<K extends keyof T>(
		key?: K,
		update?: T[K] | ((prevValue: T[K]) => T[K])
	): void {
		if (!key) {
			this.save_data_to_firebase();
			return;
		}

		if (!update || !this.docRef || !this.value) {
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
}
