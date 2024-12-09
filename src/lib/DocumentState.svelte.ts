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
  limit,
  QueryDocumentSnapshot,
  type SnapshotOptions,
  type FirestoreDataConverter,
  type WithFieldValue
} from "firebase/firestore";
import { type Auth } from "firebase/auth";
import { get_firebase_user_promise } from "./utils.svelte.js";
import { SubscriberState } from "./SubscriberState.svelte.js";

type FromFirestore<
  DataApp extends DocumentData,
  DataDb extends DocumentData
> = (
  snapshot: QueryDocumentSnapshot<DataApp, DataDb>,
  options?: SnapshotOptions
) => DataApp;

type ToFirestore<DataApp extends DocumentData, DataDb extends DocumentData> = (
  data: DataApp
) => DataDb;

type DocumentStateOptionsBase<
  DataDb extends DocumentData,
  DataApp extends DocumentData
> = {
  auth?: Auth;
  firestore: Firestore;
  listen?: boolean;
  fromFirestore?: FromFirestore<DataApp, DataDb>;
  toFirestore?: ToFirestore<DataApp, DataDb>;
};

type PathParam =
  | string
  | null
  | undefined
  | ((user: User | null) => string | null | undefined);

type QueryParamsFn = (user: User | null) => QueryConstraint[];

type DocumentStateOptions<
  DataDb extends DocumentData,
  DataApp extends DocumentData
> = DocumentStateOptionsBase<DataDb, DataApp> &
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
  DataDb extends DocumentData,
  DataApp extends DataDb & { id: string } = DataDb & { id: string }
> extends SubscriberState<DataApp | null> {
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
  private readonly fromFirestore?: FromFirestore<DataApp, DataDb>;
  private readonly toFirestore?: ToFirestore<DataApp, DataDb>;
  private readonly converter: FirestoreDataConverter<DataApp, DataDb>;

  constructor({
    auth,
    firestore,
    path: pathFunctionOrString,
    collectionPath: collectionPathFunctionOrString,
    query: queryParams,
    listen: listenAtStart = false,
    fromFirestore,
    toFirestore
  }: DocumentStateOptions<DataDb, DataApp>) {
    super();

    this.auth = auth;
    this.firestore = firestore;
    this.pathFunctionOrString = pathFunctionOrString;
    this.collectionPathFunctionOrString = collectionPathFunctionOrString;
    this.listenAtStart = listenAtStart;
    this.getUser = get_firebase_user_promise(this.auth);
    this.queryParams = queryParams;
    this.fromFirestore = fromFirestore;
    this.toFirestore = toFirestore;

    const defaultFromFirestore: FromFirestore<DataApp, DataDb> = (snap) => ({
      ...snap.data(),
      id: snap.id
    });

    const defaultToFirestore: ToFirestore<DataApp, DataDb> = (data) => {
      const { id, ...rest } = data;
      return rest as unknown as DataDb;
    };

    this.converter = {
      toFirestore: this.toFirestore ?? defaultToFirestore,
      fromFirestore: this.fromFirestore ?? defaultFromFirestore
    };
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
        this.converter
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
      this.docRef = querySnapshot.docs[0]?.ref.withConverter(this.converter);
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
      this.value = docSnap.data() as DataApp;
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
      const newData = docSnap.data() as DataApp;
      // TODO: Check if the data we receive is the same as the one we have
      // in this case we don't need to update the value
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

  get data(): DataApp | null | undefined {
    return this.value;
  }

  set data(data: DataApp | null) {
    this.value = data;
  }

  // public save() {
  //   console.log("SAVE");
  // }

  public save<K extends keyof DataApp>(
    key?: K,
    update?: DataApp[K] | ((prevValue: DataApp[K]) => DataApp[K])
  ): void {
    if (!key) {
      this.save_data_to_firebase();
      return;
    }

    if (!update || !this.docRef || !this.value) {
      return;
    }
    let newValue: DataApp[K];
    if (typeof update === "function") {
      const updateFn = update as (prevValue: DataApp[K]) => DataApp[K];
      const prevValue = this.value[key];
      newValue = updateFn(prevValue);
    } else {
      newValue = update;
    }

    this.value[key] = newValue as NonNullable<DataApp>[K];

    this.save_data_to_firebase();
  }
}
