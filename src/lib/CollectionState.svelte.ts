import { type User } from "firebase/auth";
import {
	collection,
	Firestore,
	getDocs,
	Query,
	query as firestoreQuery,
	type DocumentData,
	onSnapshot,
	type Unsubscribe,
	QueryDocumentSnapshot,
	addDoc,
	CollectionReference
} from "firebase/firestore";
import { type Auth } from "firebase/auth";
import { get_firebase_user_promise } from "./utils.svelte.js";
import { SubscriberState } from "./SubscriberState.svelte.js";

type CreateCollectionStateOptionsBase = {
	auth?: Auth;
	firestore: Firestore;
	listen?: boolean;
};

type CreateCollectionStateOptions = CreateCollectionStateOptionsBase &
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

export class CollectionState<T = DocumentData> extends SubscriberState<T[]> {
	private queryRef: Query | undefined;
	private unsub: Unsubscribe | undefined;
	private loading = $state(false);

	private collection_ref: CollectionReference | undefined;
	private readonly auth: Auth | undefined;
	private readonly firestore: Firestore;
	private readonly queryFn?: (user: User | null) => Promise<Query>;
	private readonly pathFunctionOrString?:
		| string
		| ((user: User | null) => Promise<string>);
	private readonly listenAtStart: boolean;
	private readonly getUser: Promise<User | null>;

	constructor({
		auth,
		firestore,
		query: queryFn,
		path: pathFunctionOrString,
		listen: listenAtStart = false
	}: CreateCollectionStateOptions) {
		super();
		this.auth = auth;
		this.firestore = firestore;
		this.queryFn = queryFn;
		this.pathFunctionOrString = pathFunctionOrString;
		this.listenAtStart = listenAtStart;
		this.getUser = get_firebase_user_promise(this.auth);
	}

	private async getQueryRef(): Promise<Query | undefined> {
		if (this.queryRef) {
			return this.queryRef;
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
			this.collection_ref = collection(this.firestore, ...pathArray);
			this.queryRef = firestoreQuery(this.collection_ref);
		} else if (this.queryFn) {
			this.queryRef = await this.queryFn(user);
		}

		return this.queryRef;
	}

	private mapData(doc: QueryDocumentSnapshot<DocumentData, DocumentData>): T {
		return doc.data() as T;
	}

	private async fetch_data(): Promise<void> {
		this.loading = true;
		const queryRef = await this.getQueryRef();
		if (!queryRef) {
			return;
		}
		const querySnapshot = await getDocs(queryRef);
		this.value = querySnapshot.docs.map((doc) => this.mapData(doc));
		this.loading = false;
	}

	private async listen(
		callback?: (d: T[]) => void
	): Promise<Unsubscribe | undefined> {
		if (this.unsub) {
			return;
		}
		const queryRef = await this.getQueryRef();
		if (!queryRef) {
			return;
		}
		this.unsub = onSnapshot(queryRef, (querySnapshot) => {
			if (querySnapshot.empty) {
				callback?.([]);
				this.value = [];
				return;
			}
			const newData = querySnapshot.docs.map((doc) => this.mapData(doc));
			this.value = newData;
			callback?.(this.value);
		});
		return this.unsub;
	}

	start(): void {
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

	get data(): T[] | undefined {
		return this.value;
	}

	get isLoading(): boolean {
		return this.loading;
	}

	refetch(): Promise<void> {
		return this.fetch_data();
	}

	async add(data: T): Promise<string | void> {
		if (!this.collection_ref) {
			return;
		}
		const currentData = this.value || [];
		this.value = [...currentData, data];
		const docRef = await addDoc(this.collection_ref, data as DocumentData);
		return docRef.id;
	}
}
