import {
  collection,
  getDocs,
  query as firestoreQuery,
  onSnapshot,
  deleteDoc,
  doc,
  type Query,
  type DocumentData,
  type QueryDocumentSnapshot,
  type CollectionReference,
  type AggregateSpec,
  setDoc
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

enum COLLECTION_STATE_ERRORS {
  NO_COLLECTION_REF = "Collection reference is not set",
  NO_QUERY_REF = "Query reference is not set",
  NO_PATH_STRING = "Path string is not set"
}

export class CollectionState<
  DataDb extends DocumentData,
  DataApp extends DocumentData = DataDb & { id: string },
  AggregateData = any
> extends FirestoreState<DataDb, DataApp, DataApp[]> {
  private readonly queryFunction?: QueryParamsFn;
  private readonly aggregateState?: CollectionAggregateState<AggregateData>;

  private queryRef: Query<DataApp, DataDb> | undefined;
  private collectionRef: CollectionReference<DataApp, DataDb> | undefined;

  constructor({
    auth,
    firestore,
    query: queryFunction,
    path: pathFunctionOrString,
    listen = false,
    fromFirestore,
    toFirestore,
    aggregate,
    converter
  }: CollectionStateOptions<DataDb, DataApp>) {
    super({
      auth,
      firestore,
      listen,
      fromFirestore,
      toFirestore,
      pathFunctionOrString,
      converter
    });

    this.queryFunction = queryFunction;

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
    return collection(this.firestore, ...pathArray).withConverter(
      this.converter
    );
  }

  protected async init() {
    const user = await this.getUserPromise;

    const pathStr = this.get_path_string(user);

    if (!pathStr) {
      throw new Error(COLLECTION_STATE_ERRORS.NO_PATH_STRING);
    }

    this.collectionRef = this.get_collection_from_path(pathStr);
  }

  // Set query reference with query function
  private async setup_query_ref(): Promise<typeof this.queryRef | undefined> {
    if (!this.collectionRef) {
      throw new Error(COLLECTION_STATE_ERRORS.NO_COLLECTION_REF);
    }

    const user = await this.getUserPromise;
    const queryParams = this.queryFunction ? this.queryFunction(user) : [];
    return firestoreQuery(this.collectionRef, ...queryParams);
  }

  private map_data(doc: QueryDocumentSnapshot<DataApp, DocumentData>): DataApp {
    return doc.data();
  }

  protected async fetch_data(): Promise<void> {
    this.loading = true;

    this.queryRef = await this.setup_query_ref();
    if (!this.queryRef) {
      throw new Error(COLLECTION_STATE_ERRORS.NO_QUERY_REF);
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

    this.queryRef = await this.setup_query_ref();
    if (!this.queryRef) {
      throw new Error(COLLECTION_STATE_ERRORS.NO_QUERY_REF);
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

  public async add(data: DataDb | DataApp): Promise<string | void> {
    if (!this.collectionRef) {
      console.error("Collection reference is not set");
      return;
    }

    const docRef = doc(this.collectionRef);

    // TODO: Here we have the id from docRef, we could do optimistic update
    // this.data = [...currentData, data];

    await setDoc(docRef, data as DataApp);

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
      throw new Error(COLLECTION_STATE_ERRORS.NO_COLLECTION_REF);
    }

    return doc(this.collectionRef, id);
  }

  public refetch_aggregate_data(): void {
    this.aggregateState?.refetch();
  }

  public async get_query_ref(): Promise<Query<DataApp, DataDb> | undefined> {
    await this.initPromise;
    this.queryRef = await this.setup_query_ref();
    return this.queryRef;
  }

  public async get_collection_ref(): Promise<
    CollectionReference<DataApp, DataDb> | undefined
  > {
    await this.initPromise;
    return this.collectionRef;
  }
}
