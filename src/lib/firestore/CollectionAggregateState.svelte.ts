import {
  type Query,
  type AggregateSpec,
  getAggregateFromServer,
  collection,
  query as firestoreQuery,
  onSnapshot
} from "firebase/firestore";
import {
  FirestoreState,
  type FirestoreStateOptions,
  type PathParam
} from "./FirestoreState.svelte.js";

type CollectionAggregateStateOptions = Omit<
  FirestoreStateOptions<any, any>,
  "pathFunctionOrString" | "fromFirestore" | "toFirestore"
> & {
  path: PathParam;
  aggregate: AggregateSpec;
};

export class CollectionAggregateState<
  AggregateData = Record<string, unknown>
> extends FirestoreState<any, any, AggregateData | null> {
  private readonly aggregate: AggregateSpec;
  private queryRef: Query | undefined;

  constructor({
    auth,
    firestore,
    path: pathFunctionOrString,
    listen = false,
    aggregate
  }: CollectionAggregateStateOptions) {
    super({
      auth,
      firestore,
      listen,
      pathFunctionOrString,
      fromFirestore: (data) => data,
      toFirestore: (data) => data
    });

    this.aggregate = aggregate;
  }

  private get_collection_from_path(path: string) {
    const pathArray: [string, ...string[]] = path.split("/") as [
      string,
      ...string[]
    ];
    return collection(this.firestore, ...pathArray);
  }

  protected async init() {
    const user = await this.getUserPromise;
    const pathStr = this.get_path_string(user);

    if (!pathStr) {
      throw new Error("Path string is not set");
    }

    const collectionRef = this.get_collection_from_path(pathStr);
    this.queryRef = firestoreQuery(collectionRef);
  }

  protected async fetch_data(): Promise<void> {
    this.loading = true;

    if (!this.queryRef) {
      throw new Error("Query reference is not set");
    }

    const querySnapshot = await getAggregateFromServer(
      this.queryRef,
      this.aggregate
    );
    this.data = querySnapshot.data() as AggregateData;

    this.loading = false;
  }

  protected async listen_data(): Promise<void> {
    if (this.unsub) {
      return;
    }

    if (!this.queryRef) {
      throw new Error("Query reference is not set");
    }

    // Firestore does not support listening to aggregate queries
    // so we need to listen to the collection and re-fetch the data
    this.unsub = onSnapshot(this.queryRef, () => {
      this.fetch_data();
    });

    return;
  }
}
