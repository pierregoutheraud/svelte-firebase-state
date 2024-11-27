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
	QueryDocumentSnapshot
} from "firebase/firestore";
import { type Auth } from "firebase/auth";
import { tick } from "svelte";
import { get_firebase_user_promise } from "./utils.svelte.js";

type CreateCollectionStateOptionsBase = {
	auth: Auth;
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
				auth: Auth;
				firestore: Firestore;
				path?: (user: User | null) => Promise<string>;
				query?: never;
				listen?: boolean;
		  }
	);

export function createCollectionState<T = DocumentData>({
	auth,
	firestore,
	query: queryFn,
	path: pathFn,
	listen: listenAtStart = false
}: CreateCollectionStateOptions) {
	let data: T[] | undefined = $state(undefined);
	let queryRef: Query | undefined;
	let unsub: Unsubscribe | undefined;
	let subscribers = 0;
	let loading = $state(false);

	async function getQueryRef() {
		if (queryRef) {
			return queryRef;
		}

		const user = await getUser;

		if (pathFn) {
			const pathStr = await pathFn(user);
			const pathArray: [string, ...string[]] = pathStr.split("/") as [
				string,
				...string[]
			];

			queryRef = firestoreQuery(collection(firestore, ...pathArray));
		} else if (queryFn) {
			queryRef = await queryFn(user);
		}

		return queryRef;
	}

	async function fetchData() {
		loading = true;
		const queryRef = await getQueryRef();

		if (!queryRef) {
			return;
		}

		const querySnapshot = await getDocs(queryRef);
		data = querySnapshot.docs.map(mapData);
		loading = false;
	}

	function mapData(doc: QueryDocumentSnapshot<DocumentData, DocumentData>) {
		return doc.data() as T;
	}

	async function listen(callback?: (d: T[]) => void) {
		// Already listening
		if (unsub) {
			return;
		}

		const queryRef = await getQueryRef();

		if (!queryRef) {
			return;
		}

		unsub = onSnapshot(queryRef, (querySnapshot) => {
			if (querySnapshot.empty) {
				callback?.([]);
				data = [];
				return;
			}
			const newData = querySnapshot.docs.map(mapData);
			data = newData;
			callback?.(data);
		});

		return unsub;
	}

	const getUser = get_firebase_user_promise(auth);

	function start() {
		if (listenAtStart) {
			listen();
		} else {
			fetchData();
		}
	}

	function stop() {
		if (unsub) {
			unsub();
			unsub = undefined;
		}
	}

	return {
		get data() {
			if ($effect.tracking()) {
				$effect(() => {
					if (subscribers === 0) {
						start();
					}
					subscribers++;

					// When data is updated inside start(), this $effect will run again because it tracks data
					// which will run the cleanup function first (cleanup is always run before the effect except the 1st time)
					// We use tick to run the cleanup function after the second $effect to keep the correct count of subscribers
					// and avoid an infinite loop
					// https://svelte.dev/docs/svelte/$effect#$effect.tracking
					return () => {
						tick().then(() => {
							subscribers--;
							if (subscribers === 0) {
								stop();
							}
						});
					};
				});
			}

			return data;
		},
		get loading() {
			return loading;
		},
		refetch: fetchData
	};
}
