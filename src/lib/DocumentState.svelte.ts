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
  getDocs,
  collection,
  query,
  QueryConstraint,
  limit
} from "firebase/firestore";
import { type Auth } from "firebase/auth";
import {
  genericIdConverter,
  get_firebase_user_promise
} from "./utils.svelte.js";
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

type QueryParamsFn = (user: User | null) => QueryConstraint[];

type DocumentStateOptions = DocumentStateOptionsBase &
  (
    | {
        path?: never;
        collectionPath?: PathParam;
        query?: QueryParamsFn;
      }
    | {
        path?: PathParam;
        collectionPath?: never;
        query?: never;
      }
  );

export class DocumentState<
  T extends DocumentData,
  TConverted extends T & { id: string } = T & { id: string }
> extends SubscriberState<TConverted | null> {
  private docRef: DocumentReference | undefined;
  private unsub: Unsubscribe | undefined;
  private loading = $state(false);
  private queryRef: Query | undefined;

  private readonly auth?: Auth;
  private readonly firestore: Firestore;
  private readonly pathFunctionOrString?: PathParam;
  private readonly collectionPathFunctionOrString?: PathParam;
  private readonly listenAtStart: boolean;
  private readonly getUser: Promise<User | null>;
  private readonly queryParams?: QueryParamsFn;

  constructor({
    auth,
    firestore,
    path: pathFunctionOrString,
    collectionPath: collectionPathFunctionOrString,
    query: queryParams,
    listen: listenAtStart = false
  }: DocumentStateOptions) {
    super();

    this.auth = auth;
    this.firestore = firestore;
    this.pathFunctionOrString = pathFunctionOrString;
    this.collectionPathFunctionOrString = collectionPathFunctionOrString;
    this.listenAtStart = listenAtStart;
    this.getUser = get_firebase_user_promise(this.auth);
    this.queryParams = queryParams;
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

  private async get_doc_ref(): Promise<typeof this.docRef | undefined> {
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

      this.docRef = doc(this.firestore, ...pathArray).withConverter(
        genericIdConverter<T, TConverted>()
      );
    } else if (this.collectionPathFunctionOrString) {
      // Run query and get first document ref

      let collectionPath: string | null | undefined;
      if (typeof this.collectionPathFunctionOrString === "function") {
        collectionPath = this.collectionPathFunctionOrString(user);
      } else {
        collectionPath = this.collectionPathFunctionOrString;
      }

      if (!collectionPath || !this.queryParams) {
        throw new Error(
          `"collectionPath" and "query" options must be defined.`
        );
      }

      const queryRef = query(
        collection(this.firestore, collectionPath),
        ...this.queryParams(user),
        limit(1)
      );

      if (!queryRef) {
        this.docRef = undefined;
        return this.docRef;
      }

      this.queryRef = queryRef;
      const querySnapshot = await getDocs(queryRef);
      this.docRef = querySnapshot.docs[0]?.ref;
    }

    return this.docRef;
  }

  private async fetch_data(): Promise<void> {
    this.loading = true;

    const docRef = await this.get_doc_ref();
    if (!docRef) {
      this.value = null;
      return;
    }

    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      this.value = null;
    } else {
      this.value = docSnap.data() as TConverted;
    }

    this.loading = false;
  }

  private async listen(): Promise<Unsubscribe | undefined> {
    if (this.unsub) {
      return;
    }

    await this.get_doc_ref();

    if (!this.docRef) {
      // If there is no docRef, we can still try to listen to the queryRef
      this.listen_to_query();
      return;
    }

    this.listen_to_doc();
  }

  listen_to_query() {
    if (!this.queryRef) {
      return;
    }

    this.unsub?.();
    this.unsub = onSnapshot(this.queryRef, (querySnapshot) => {
      if (!querySnapshot.empty) {
        // We found a document
        const docSnap = querySnapshot.docs[0];
        this.docRef = docSnap.ref;
        this.unsub?.();
        this.listen_to_doc();
      } else {
        this.value = null;
      }
    });

    return this.unsub;
  }

  listen_to_doc() {
    if (!this.docRef) {
      return;
    }

    this.unsub?.();
    this.unsub = onSnapshot(this.docRef, (docSnap) => {
      if (!docSnap.exists()) {
        this.value = null;
        // If the document doesn't exist
        // We can still try to listen to the queryRef
        this.listen_to_query();
        return;
      }
      const newData = docSnap.data() as TConverted;
      this.value = newData;
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

  get data(): TConverted | null | undefined {
    return this.value;
  }

  set data(data: TConverted | null) {
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

    this.value[key] = newValue as NonNullable<TConverted>[K];

    this.save_data_to_firebase();
  }
}
