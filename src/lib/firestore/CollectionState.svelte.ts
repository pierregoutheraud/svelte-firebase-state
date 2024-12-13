import {
  collection,
  getDocs,
  query as firestoreQuery,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  type Query,
  type DocumentData,
  type QueryDocumentSnapshot,
  type CollectionReference
} from "firebase/firestore";
import {
  FirestoreState,
  type FirestoreStateOptions,
  type PathParam,
  type QueryParamsFn
} from "./FirestoreState.svelte.js";

type CollectionStateOptions<
  DataDb extends DocumentData,
  DataApp extends DocumentData
> = Omit<FirestoreStateOptions<DataDb, DataApp>, "pathFunctionOrString"> & {
  path: PathParam;
  query?: QueryParamsFn;
};

export class CollectionState<
  DataDb extends DocumentData,
  DataApp extends DataDb & { id: string } = DataDb & { id: string }
> extends FirestoreState<DataDb, DataApp, DataApp[]> {
  private readonly queryParamsFn?: QueryParamsFn;

  private queryRef: Query | undefined;
  private collectionRef: CollectionReference | undefined;

  constructor({
    auth,
    firestore,
    query: queryParamsFn,
    path: pathFunctionOrString,
    listen: listenAtStart = false,
    fromFirestore,
    toFirestore
  }: CollectionStateOptions<DataDb, DataApp>) {
    super({
      auth,
      firestore,
      listen: listenAtStart,
      fromFirestore,
      toFirestore,
      pathFunctionOrString
    });

    this.queryParamsFn = queryParamsFn;
  }

  private get_collection_from_path(path: string) {
    const pathArray: [string, ...string[]] = path.split("/") as [
      string,
      ...string[]
    ];
    return collection(this.firestore, ...pathArray);
  }

  protected async init_ref(): Promise<Query | undefined> {
    if (this.queryRef) {
      return this.queryRef;
    }

    const user = await this.getUser;

    let pathStr = this.get_path_string(user);

    if (!pathStr) {
      throw new Error("Path string is not set");
    }

    this.collectionRef = this.get_collection_from_path(pathStr);

    const queryParams = this.queryParamsFn ? this.queryParamsFn(user) : [];

    this.queryRef = firestoreQuery(this.collectionRef, ...queryParams);

    return this.queryRef;
  }

  public async get_query_ref(): Promise<Query | undefined> {
    await this.init_ref();
    return this.queryRef;
  }

  public async get_collection_ref(): Promise<Query | undefined> {
    await this.init_ref();
    return this.collectionRef;
  }

  private map_data(doc: QueryDocumentSnapshot<DataApp, DocumentData>): DataApp {
    return doc.data();
  }

  protected async fetch_data(): Promise<void> {
    this.loading = true;

    if (!this.queryRef) {
      throw new Error("Query reference is not set");
    }

    const querySnapshot = await getDocs(
      this.queryRef.withConverter(this.converter)
    );
    this.value = querySnapshot.docs.map(this.map_data);

    this.loading = false;
  }

  protected async listen(callback?: (d: DataApp[]) => void): Promise<void> {
    if (this.unsub) {
      return;
    }

    if (!this.queryRef) {
      throw new Error("Query reference is not set");
    }

    this.unsub = onSnapshot(
      this.queryRef.withConverter(this.converter),
      (querySnapshot) => {
        if (querySnapshot.empty) {
          callback?.([]);
          this.value = [];
          return;
        }
        const newData = querySnapshot.docs.map(this.map_data);
        this.value = newData;
        callback?.(this.value);
      }
    );

    return;
  }

  stop(): void {
    if (this.unsub) {
      this.unsub();
      this.unsub = undefined;
    }
  }

  async add(data: DataDb): Promise<string | void> {
    if (!this.collectionRef) {
      console.error("Collection reference is not set");
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

  get_doc_ref(id: string) {
    if (!this.collectionRef) {
      throw new Error("Collection reference is not set");
    }

    return doc(this.collectionRef, id);
  }

  async delete(id: string): Promise<void> {
    if (!this.collectionRef) {
      return;
    }

    const docRef = this.get_doc_ref(id);
    return deleteDoc(docRef);
  }
}
