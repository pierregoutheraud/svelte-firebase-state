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
  type CollectionReference,
  type AggregateSpec
} from "firebase/firestore";
import {
  FirestoreState,
  type FirestoreStateOptions,
  type PathParam,
  type QueryParamsFn
} from "./FirestoreState.svelte.js";
import { CollectionAggregateState } from "./CollectionAggregateState.svelte.js";

type CollectionStateOptions<
  DataDb extends DocumentData,
  DataApp extends DocumentData
> = Omit<FirestoreStateOptions<DataDb, DataApp>, "pathFunctionOrString"> & {
  path: PathParam;
  query?: QueryParamsFn;
  aggregate?: AggregateSpec;
};

export class CollectionState<
  DataDb extends DocumentData,
  DataApp extends DataDb & { id: string } = DataDb & { id: string },
  AggregateData = any
> extends FirestoreState<DataDb, DataApp, DataApp[]> {
  private readonly queryParamsFn?: QueryParamsFn;
  private readonly aggregateState?: CollectionAggregateState<AggregateData>;

  private queryRef: Query<DataApp, DataDb> | undefined;
  private collectionRef: CollectionReference<DataApp, DataDb> | undefined;

  constructor({
    auth,
    firestore,
    query: queryParamsFn,
    path: pathFunctionOrString,
    listen = false,
    fromFirestore,
    toFirestore,
    aggregate
  }: CollectionStateOptions<DataDb, DataApp>) {
    super({
      auth,
      firestore,
      listen,
      fromFirestore,
      toFirestore,
      pathFunctionOrString
    });

    this.queryParamsFn = queryParamsFn;

    if (aggregate) {
      this.aggregateState = new CollectionAggregateState<AggregateData>({
        auth,
        firestore,
        path: pathFunctionOrString,
        aggregate,
        listen
      });
    }
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

    this.queryRef = firestoreQuery(
      this.collectionRef,
      ...queryParams
    ).withConverter(this.converter);

    return this.queryRef;
  }

  private map_data(doc: QueryDocumentSnapshot<DataApp, DocumentData>): DataApp {
    return doc.data();
  }

  protected async fetch_data(): Promise<void> {
    this.loading = true;

    if (!this.queryRef) {
      throw new Error("Query reference is not set");
    }

    const querySnapshot = await getDocs(this.queryRef);
    this.data = querySnapshot.docs.map(this.map_data);

    this.loading = false;
  }

  protected async listen_data(
    callback?: (d: DataApp[]) => void
  ): Promise<void> {
    if (this.unsub) {
      return;
    }

    if (!this.queryRef) {
      throw new Error("Query reference is not set");
    }

    this.unsub = onSnapshot(this.queryRef, (querySnapshot) => {
      if (querySnapshot.empty) {
        callback?.([]);
        this.data = [];
        return;
      }
      const newData = querySnapshot.docs.map(this.map_data);
      this.data = newData;
      callback?.(this.data);
    });

    return;
  }

  public async add(data: DataDb): Promise<string | void> {
    if (!this.collectionRef) {
      console.error("Collection reference is not set");
      return;
    }

    const currentData = this.data || [];
    const randomId = Math.random().toString(36).substring(7);
    const newData = { id: randomId, ...data } as DataApp;
    this.data = [...currentData, newData];
    const docRef = await addDoc(this.collectionRef, data as DocumentData);
    this.data = this.data.map((d) => {
      if (d.id === randomId) {
        return { id: docRef.id, ...data } as DataApp;
      }
      return d;
    });
    return docRef.id;
  }

  public get aggregateData(): AggregateData | null | undefined {
    return this.aggregateState?.data;
  }

  public async delete(id: string): Promise<void> {
    if (!this.collectionRef) {
      return;
    }

    const docRef = this.get_doc_ref(id);
    return deleteDoc(docRef);
  }

  public get_doc_ref(id: string) {
    if (!this.collectionRef) {
      throw new Error("Collection reference is not set");
    }

    return doc(this.collectionRef, id);
  }

  public refetch_aggregate_data(): void {
    this.aggregateState?.refetch();
  }

  public async get_query_ref(): Promise<Query<DataApp, DataDb> | undefined> {
    await this.init_ref();
    return this.queryRef;
  }

  public async get_collection_ref(): Promise<
    CollectionReference<DataApp, DataDb> | undefined
  > {
    await this.init_ref();
    return this.collectionRef;
  }
}
