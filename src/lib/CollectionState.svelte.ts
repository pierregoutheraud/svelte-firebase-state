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
  CollectionReference,
  deleteDoc,
  doc,
  QueryConstraint,
  type FirestoreDataConverter
} from "firebase/firestore";
import { type Auth, type User } from "firebase/auth";
import {
  get_firebase_user_promise,
  type FromFirestore,
  type ToFirestore
} from "./utils.svelte.js";
import { SubscriberState } from "./SubscriberState.svelte.js";

type QueryParamsFn = (user: User | null) => QueryConstraint[];

type CollectionStateOptions<
  DataDb extends DocumentData,
  DataApp extends DocumentData
> = {
  auth?: Auth;
  firestore: Firestore;
  path: string | ((user: User | null) => string);
  query?: QueryParamsFn;
  listen?: boolean;
  fromFirestore?: FromFirestore<DataApp, DataDb>;
  toFirestore?: ToFirestore<DataApp, DataDb>;
};

export class CollectionState<
  DataDb extends DocumentData,
  DataApp extends DataDb & { id: string } = DataDb & { id: string }
> extends SubscriberState<DataApp[] | null> {
  private queryRef: Query | undefined;
  private unsub: Unsubscribe | undefined;
  private loading = $state(false);

  private collectionRef: CollectionReference | undefined;
  private readonly auth: Auth | undefined;
  private readonly firestore: Firestore;
  private readonly queryParamsFn?: QueryParamsFn;
  private readonly pathFunctionOrString:
    | string
    | ((user: User | null) => string);
  private readonly listenAtStart: boolean;
  private readonly getUser: Promise<User | null>;
  private readonly converter: FirestoreDataConverter<DataApp, DataDb>;

  constructor({
    auth,
    firestore,
    query: queryParamsFn,
    path: pathFunctionOrString,
    listen: listenAtStart = false,
    fromFirestore,
    toFirestore
  }: CollectionStateOptions<DataDb, DataApp>) {
    super();
    this.auth = auth;
    this.firestore = firestore;
    this.queryParamsFn = queryParamsFn;
    this.pathFunctionOrString = pathFunctionOrString;
    this.listenAtStart = listenAtStart;
    this.getUser = get_firebase_user_promise(this.auth);

    const defaultFromFirestore: FromFirestore<DataApp, DataDb> = (snap) => ({
      ...snap.data(),
      id: snap.id
    });

    const defaultToFirestore: ToFirestore<DataApp, DataDb> = (data) => {
      const { id, ...rest } = data;
      return rest as unknown as DataDb;
    };

    this.converter = {
      toFirestore: toFirestore ?? defaultToFirestore,
      fromFirestore: fromFirestore ?? defaultFromFirestore
    };
  }

  private getCollectionFromPath(path: string) {
    const pathArray: [string, ...string[]] = path.split("/") as [
      string,
      ...string[]
    ];
    return collection(this.firestore, ...pathArray);
  }

  private async getQueryRef(): Promise<Query | undefined> {
    if (this.queryRef) {
      return this.queryRef;
    }

    const user = await this.getUser;

    let pathStr: string;
    if (typeof this.pathFunctionOrString === "function") {
      pathStr = this.pathFunctionOrString(user);
    } else {
      pathStr = this.pathFunctionOrString;
    }

    this.collectionRef = this.getCollectionFromPath(pathStr);

    const queryParams = this.queryParamsFn ? this.queryParamsFn(user) : [];
    this.queryRef = firestoreQuery(this.collectionRef, ...queryParams);

    return this.queryRef;
  }

  private mapData(doc: QueryDocumentSnapshot<DataApp, DocumentData>): DataApp {
    return doc.data();
  }

  private async fetch_data(): Promise<void> {
    this.loading = true;
    const queryRef = await this.getQueryRef();
    if (!queryRef) {
      return;
    }
    const querySnapshot = await getDocs(queryRef.withConverter(this.converter));
    this.value = querySnapshot.docs.map((doc) => this.mapData(doc));
    this.loading = false;
  }

  private async listen(
    callback?: (d: DataApp[]) => void
  ): Promise<Unsubscribe | undefined> {
    if (this.unsub) {
      return;
    }
    const queryRef = await this.getQueryRef();
    if (!queryRef) {
      return;
    }
    this.unsub = onSnapshot(
      queryRef.withConverter(this.converter),
      (querySnapshot) => {
        if (querySnapshot.empty) {
          callback?.([]);
          this.value = [];
          return;
        }
        const newData = querySnapshot.docs.map((doc) => this.mapData(doc));
        this.value = newData;
        callback?.(this.value);
      }
    );
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

  get data(): DataApp[] | null | undefined {
    return this.value;
  }

  get isLoading(): boolean {
    return this.loading;
  }

  refetch(): Promise<void> {
    return this.fetch_data();
  }

  async add(data: DataDb): Promise<string | void> {
    if (!this.collectionRef) {
      console.log("Collection reference is not set");
      return;
    }

    const currentData = this.value || [];
    const randomId = Math.random().toString(36).substring(7);
    const newData = { id: randomId, ...data } as DataApp;
    this.value = [...currentData, newData];
    const docRef = await addDoc(this.collectionRef, data as DocumentData);
    this.value = this.value.map((d) => {
      if (d.id === randomId) {
        return { id: docRef.id, ...data } as DataApp;
      }
      return d;
    });
    return docRef.id;
  }

  getDocRef(id: string) {
    if (!this.collectionRef) {
      throw new Error("Collection reference is not set");
    }

    return doc(this.collectionRef, id);
  }

  async delete(id: string): Promise<void> {
    if (!this.collectionRef) {
      return;
    }

    const docRef = this.getDocRef(id);
    return deleteDoc(docRef);
  }
}
